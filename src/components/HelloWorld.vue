<template>
<section id="hero">
    <v-img
      min-height="600"
      width="100%"
      src="@/assets/logo.svg"
      class="white--text"
      gradient="to bottom, rgba(5,121,17,1), rgba(0,0,0,.4)"
    >
      <v-container class="fill-height px-4 py-12">
        <v-responsive
          class="d-flex align-center mx-auto"
          height="100%"
          max-width="700"
          width="100%"
        >

          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae nobis neque aspernatur in quas iure id aliquid, esse debitis, quibusdam mollitia! Quia ea expedita magnam totam, earum omnis et perspiciatis?
          </p>

          <div
            :class="$vuetify.breakpoint.smAndDown ? 'flex-column align-start' : 'align-center'"
            class="d-flex flex-wrap"
          >

            <v-btn
              to="/productos"
              class="font-weight-bold my-2 py-3"
              x-large
              color="success"
              height="auto"
            >
              Ir a productos
            </v-btn>
          </div>
        </v-responsive>
      </v-container>
    </v-img>
  </section>
</template>

<script>
  export default {
    name: 'HelloWorld',
 
   data () {
      return {
      }
    },
    computed:{
      minHeight () {
        const height = this.$vuetify.breakpoint.mdAndUp ? '100vh' : '50vh'

        return `calc(${height} - ${this.$vuetify.application.top}px)`
      },
    }
  } 
</script>
