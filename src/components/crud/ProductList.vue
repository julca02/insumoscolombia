<template>
  <v-data-table
    :search="search"
    :headers="headers"
    :items="productos"
    sort-by="calories"
    class="elevation-1"
    :loading="loading"
    loading-text="Loading... Please wait"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Productos</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>

        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Nuevo producto
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.codigo_producto"
                      label="Código del producto"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.id_linea"
                      label="Código de línea"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.id_sublinea"
                      label="Código de sublinea"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-textarea
                      v-model="editedItem.descripcion"
                      label="Nueva descripción"
                      auto-grow
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.costo_ultimo"
                      label="Último costo"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.stock"
                      label="Cantidad"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Cancelar
              </v-btn>
              <v-btn color="blue darken-1" text @click="save"> Guardar </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >¿Estás seguro que deseas eliminar?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancelar</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)" color="#BBDEFB"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)" color="#E57373"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="getProducts"> Reiniciar </v-btn>
    </template>
  </v-data-table>
</template>
<script>
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "@/services/ProductsAPI";
export default {
  data: () => ({
    dialog: false,
    search: "",
    dialogDelete: false,
    headers: [
      {
        text: "id",
        align: "start",
        value: "id",
      },

      { text: "Codigo Producto", value: "codigo_producto" },
      { text: "Código Linea", value: "id_linea" },
      { text: "Código Sublinea", value: "id_sublinea" },
      { text: "Descriptción", value: "descripcion" },
      { text: "Costo último", value: "costo_ultimo" },
      { text: "Stock", value: "stock" },
      { text: "Fecha de creación", value: "created_at" },
      { text: "Acciones", value: "actions" },
    ],
    loading: true,
    productos: [],
    editedIndex: -1,
    editedItem: {
      id: 0,
      codigo_producto: 0,
      id_linea: 0,
      id_sublinea: 0,
      descripcion: "",
      costo_ultimo: 0,
      stock: 0,
    },
    defaultItem: {
      id: 0,
      codigo_producto: 0,
      id_linea: 0,
      id_sublinea: 0,
      descripcion: "",
      costo_ultimo: 0,
      stock: 0,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Agregar nuevo producto"
        : "Editar producto";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.getProducts();
  },

  methods: {
    async getProducts() {
      let response = await getProducts();
      this.productos = response.data;
      this.loading = false;
    },

    editItem(item) {
      this.editedIndex = this.productos.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.productos.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      await deleteProduct(this.editedItem.id);
      this.getProducts();
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      if (this.editedIndex > -1) {
        await updateProduct(this.editedItem.id, this.editedItem);
        this.getProducts();
      } else {
        await createProduct(this.editedItem);
        this.getProducts();
      }
      this.close();
    },
  },
};
</script>

<style>
</style>