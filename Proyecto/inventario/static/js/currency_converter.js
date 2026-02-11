/**
 * Utility to fetch BCV (Central Bank of Venezuela) exchange rate and convert prices.
 */
const CurrencyConverter = {
    // Community-maintained API that proxies BCV data
    API_URL: 'https://ve.dolarapi.com/v1/dolares/oficial',

    /**
     * Fetches the official exchange rate from BCV via proxy API.
     * Caches the result in sessionStorage to minimize API calls.
     */
    async getExchangeRate() {
        const cachedRate = sessionStorage.getItem('bcv_exchange_rate');
        const cacheTimestamp = sessionStorage.getItem('bcv_rate_timestamp');
        const now = Date.now();

        // Use cache if available and younger than 1 hour
        if (cachedRate && cacheTimestamp && (now - cacheTimestamp < 3600000)) {
            return parseFloat(cachedRate);
        }

        try {
            const response = await fetch(this.API_URL);
            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            const rate = parseFloat(data.promedio);

            sessionStorage.setItem('bcv_exchange_rate', rate);
            sessionStorage.setItem('bcv_rate_timestamp', now);

            return rate;
        } catch (error) {
            console.error('Error fetching BCV rate:', error);
            // Fallback to cache even if old, or null if never fetched
            return cachedRate ? parseFloat(cachedRate) : null;
        }
    },

    /**
     * Converts VES to USD.
     */
    toUSD(vesAmount, rate) {
        if (!rate || rate === 0) return null;
        return (vesAmount / rate).toFixed(2);
    },

    /**
     * Formats a number as currency.
     */
    formatCurrency(amount, currency = 'VES') {
        const formatter = new Intl.NumberFormat('es-VE', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        });
        let formatted = formatter.format(amount);
        if (currency === 'USD') {
            formatted = formatted.replace('VES', '$').replace('Bs.', '$');
        }
        return formatted;
    },

    /**
     * Automatically finds elements with .price-ves class and appends USD price.
     * Expects standard text or a data-price attribute in VES.
     */
    async init() {
        const rate = await this.getExchangeRate();
        if (!rate) return;

        console.log(`BCV Exchange Rate (VES Base): ${rate} VES/USD`);

        $('.price-ves').each(function () {
            const $el = $(this);
            let vesPrice = parseFloat($el.attr('data-price') || $el.text().replace(/[^0-9.]/g, '').replace(',', '.'));

            if (!isNaN(vesPrice)) {
                const usdPrice = (vesPrice / rate);
                const usdFormatted = CurrencyConverter.formatCurrency(usdPrice, 'USD');

                // If it's a table cell or a list, append it nicely
                if ($el.find('.usd-price').length === 0) {
                    $el.append(`<br><small class="text-muted usd-price" style="font-size: 0.75rem;">(${usdFormatted})</small>`);
                }
            }
        });
    }
};

// Auto-init when the script is loaded if not in POS/Ventas (which handles it dynamically)
if (!window.location.pathname.includes('ventas')) {
    $(document).ready(() => CurrencyConverter.init());
}
