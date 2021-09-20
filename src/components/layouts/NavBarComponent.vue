<template>
<div>
    <v-navigation-drawer temporary v-model="sideNav" app right>
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.link"
          color="primary"
        >
          <v-list-item-content>{{ item.title }}</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="white" dense dark hide-on-scroll height="80">
      <v-container class="d-flex justify-center">
        <a href="/" class="ma-auto">
        <v-avatar size="64">
          <v-img
            lazy-src="https://picsum.photos/id/11/10/6"
            max-height="100"
            max-width="100"
            src="https://www.rake.mx/assets/mision.png"
          ></v-img>
        </v-avatar>
        </a>

        <v-spacer></v-spacer>
        <v-app-bar-nav-icon
          @click.stop="sideNav = !sideNav"
          class="hidden-lg-and-up"
          ><v-icon color="primary" large
            >mdi-microsoft-xbox-controller-menu</v-icon
          ></v-app-bar-nav-icon
        >
        <v-divider vertical></v-divider>
        <v-btn
          small
          rounded
          color="primary"
          text
          class="hidden-md-and-down ma-auto"
          v-for="(item, i) in menuItems"
          :key="i"
          :to="item.link"
        >
          {{ item.title }}
        </v-btn>
      </v-container>
    </v-app-bar>
</div>
</template>
<script>
export default {
  data: () => ({
    sideNav: false,
    menuItems: [
      { title: "Productos", link: "/productos" },
      { title: "Servicios", link: "/servicio" },
      { title: "Tienda", link: "/tienda" },
    ],
  }),
  methods: {

  },
};
</script>