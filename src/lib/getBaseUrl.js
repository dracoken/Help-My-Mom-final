export const getBaseUrl = () => {
    if (typeof window === 'undefined') {
        return process.env.BASE_URL || 'http://localhost:3000';
    }

    const isLocalhost = Boolean(
        window.location.hostname === 'localhost' ||
            window.location.hostname === '[::1]' ||
            window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
    );
    return isLocalhost ? `http://${window.location.host}` : 'https://hmm.alexanderdiaz.dev';
};