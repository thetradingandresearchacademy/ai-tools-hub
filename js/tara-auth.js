// js/tara-auth.js
const supabase = window.supabase.createClient(
    TARA_CONFIG.SUPABASE_URL, 
    TARA_CONFIG.SUPABASE_ANON_KEY
);

const TARA = {
    async register(email, password) {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });
        if (error) throw error;
        return data;
    },

    async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if (error) throw error;
        return data;
    },

    async logout() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        window.location.href = TARA_CONFIG.LOGIN_URL;
    },

    async requireLogin() {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
            // Save the attempted URL to redirect back after login
            sessionStorage.setItem('tara_return_url', window.location.href);
            window.location.href = TARA_CONFIG.LOGIN_URL;
        }
        return session;
    },

    async resetPasswordForEmail(email) {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + TARA_CONFIG.VERIFY_URL,
        });
        if (error) throw error;
        return data;
    },
    
    async checkExistingSession() {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            const returnUrl = sessionStorage.getItem('tara_return_url') || TARA_CONFIG.DASHBOARD_URL;
            sessionStorage.removeItem('tara_return_url');
            window.location.href = returnUrl;
        }
    }
};