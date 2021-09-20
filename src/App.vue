<template>
  <v-app>
    <NavBarComponent/>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import NavBarComponent from './components/layouts/NavBarComponent.vue';

export default {
  name: 'App',
  components: {
    NavBarComponent
  },

  data: () => ({
    
  }),
};
</script>
