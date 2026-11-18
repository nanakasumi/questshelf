<script setup>
import { RouterLink } from 'vue-router';
</script>
<template>
    <header class="navbar">
        <RouterLink to="/" class="navbar_logo">
            QUESTSHELF
        </RouterLink>

        <nav class="navbar_links" aria-label="Main navigation">
            <RouterLink to="/" class="navbar_link">
                Discover
            </RouterLink>

            <RouterLink to="/library/overview" class="navbar_link">
                My Library
            </RouterLink>
        </nav>
    </header>
</template>

<style scoped>
.navbar {
     display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 1800px;
    margin: 0 auto;
    padding: 0 24px;
    min-height: 64px;
    box-sizing: border-box;
    color: white;
}

.navbar_logo {
    font-size: 24px;
    font-family: 'Bebas Neue';
}

.navbar_links {
    display: flex;
    align-items: center;
    gap: 30px;
}

.navbar_link {
    padding: 8px 0;
}

.navbar_link:hover,
.navbar_link.router-link-active {
    text-decoration: underline;
}

@media (max-width: 600px) {
    .navbar {
        padding: 0 16px;
        gap: 16px;
        flex-wrap: wrap;
    }

    .navbar_links {
        gap: 16px;
        flex-wrap: wrap;
    }
}
</style>