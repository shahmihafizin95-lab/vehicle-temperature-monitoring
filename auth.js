const SUPABASE_URL =
"https://tllpfmcabjaplutfdlmv.supabase.co";

const SUPABASE_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsbHBmbWNhYmphcGx1dGZkbG12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1Nzk2NzAsImV4cCI6MjA5NzE1NTY3MH0.4jq94tfjOz3wsNZizwEiFMgG_6I-J0e9HLc9J7s_CTw";

const client =
window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);