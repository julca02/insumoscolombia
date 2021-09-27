<template>
  <v-data-table
    :search="search"
    :headers="headers"
    :items="productos"
    class="elevation-1"
    :loading="loading"
    loading-text="Cargando...Espera"
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
        <v-btn rounded color="info" dark class="mb-2" @click="imprimirDoc">
          Imprimir
        </v-btn>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              rounded
              color="#1E8449"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
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
                      :rules="codeRules"
                      label="Código del producto"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      v-model="linea"
                      label="lineas"
                      :items="lineas"
                      item-text="descripcion"
                      item-value="codigo"
                      return-object
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      v-model="sublinea"
                      label="Sublineas"
                      :items="sublineas"
                      item-text="descripcion"
                      item-value="codigo"
                      return-object
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-textarea
                      clearable
                      clear-icon="mdi-close-circle"
                      :counter="256"
                      :rules="nameRules"
                      v-model="editedItem.descripcion"
                      label="Nueva descripción"
                      auto-grow
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
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
              <v-btn color="#1E8449" rounded outlined @click="close">
                Cancelar
              </v-btn>
              <v-btn
                color="#1E8449"
                rounded
                outlined
                @click="save"
                :disabled="
                  editedItem.codigo_producto < 1 ||
                  editedItem.descripcion === ''
                "
              >
                Guardar
              </v-btn>
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
              <v-btn color="blue darken-1" rounded text @click="closeDelete"
                >Cancelar</v-btn
              >
              <v-btn color="#E74C3C" rounded text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)" color="#BBDEFB">
        mdi-pencil
      </v-icon>
      <v-icon small @click="deleteItem(item)" color="#E57373">
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="success" @click="getProducts"> Reiniciar </v-btn>
    </template>
  </v-data-table>
</template>
<script>
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/ProductsAPI";
import { getLines } from "@/services/LinesAPI";
import { getSubline } from "@/services/SublineAPI";
import { jsPDF } from "jspdf";
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
      { text: "Descripción", value: "descripcion" },
      { text: "Costo último", value: "costo_ultimo" },
      { text: "Stock", value: "stock" },
      { text: "Fecha de creación", value: `created_at` },
      { text: "Acciones", value: "actions" },
    ],
    loading: true,
    productos: [],
    lineas: [],
    linea: "",
    sublineas: [],
    sublinea: "",
    editedIndex: -1,
    editedItem: {
      id: 0,
      codigo_producto: 0,
      descripcion: "",
      stock: 0,
      sublinea: {
        codigo: 0,
        descripcion: "",
      },
      linea: {
        codigo: 0,
        descripcion: "",
      },
    },
    defaultItem: {
      id: 0,
      codigo_producto: 0,
      id_sublinea: 0,
      descripcion: "",
      stock: 0,
      sublinea: {
        codigo: 0,
        descripcion: "",
      },
      linea: {
        codigo: 0,
        descripcion: "",
      },
    },
    valid: true,
    codeRules: [
      (v) => !!v || "El codigo es requerido",
      (v) =>
        (v && v.length <= 10) || "El codigo debe de ser menor a 10 caracteres",
    ],
    nameRules: [
      (v) => !!v || "Descripcion es requerida",
      (v) =>
        (v && v.length <= 256) ||
        "El texto no puede superar los 256 caracteres",
    ],
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
    this.listLines();
    this.ListSublines();
  },

  methods: {
    async getProducts() {
      let response = await getProducts();
      this.productos = response.data;
      this.loading = false;
    },
    async listLines() {
      let response = await getLines();
      this.lineas = response.data;
    },
    async ListSublines() {
      const response = await getSubline();
      this.sublineas = response.data;
    },
    imprimirDoc() {

      function createHeaders(keys) {
        let result = [];
        for (let i = 0; i < keys.length; i += 1) {
          result.push({
            id: keys[i],
            name: keys[i],
            prompt: keys[i],
            width: 65,
            align: "center",
            padding: 0,
          });
        }
        return result;
      }

      var headers = createHeaders([
        "id",
        "codigo_producto",
        "id_linea",
        "id_sublinea",
        "descripcion",
        "costo_ultimo",
        "stock",
        "created_at"
      ]);

      var doc = new jsPDF({ putOnlyUsedFonts: true, orientation: "landscape" });
      doc.table(1, 1, JSON.parse(JSON.stringify(this.productos)), headers, { autoSize: true });
      doc.save('producto.pdf')
    },
    editItem(item) {
      this.editedIndex = this.productos.indexOf(item);
      this.linea = item ? item.codigo : "";
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
      this.linea = "";
      this.sublinea = "";
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
        await createProduct({
          codigo_producto: this.editedItem.codigo_producto,
          descripcion: this.editedItem.descripcion,
          id_linea: this.linea.codigo,
          id_sublinea: this.sublinea.codigo,
          stock: this.editedItem.stock,
        });
        this.getProducts();
      }
      this.close();
    },
  },
};
</script>