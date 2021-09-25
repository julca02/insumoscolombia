<template>
  <v-data-table
    :search="search"
    :headers="headers"
    :items="articles"
    class="elevation-1"
    :loading="loading"
    loading-text="Cargando...Espera"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Articulos</v-toolbar-title>
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
              Nuevo articulo
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      v-model="movement"
                      label="Id movimiento"
                      :items="movements"
                      item-text="cedula_mov"
                      item-value="id"
                      return-object
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.id_producto"
                      :rules="codeRules"
                      label="Código del producto"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      clearable
                      clear-icon="mdi-close-circle"
                      :rules="nameRules"
                      v-model="editedItem.cantidad"
                      label="cantidad"
                      auto-grow
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.valor"
                      label="Valor"
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
      <v-btn color="success" @click="getArticles"> Reiniciar </v-btn>
    </template>
  </v-data-table>
</template>
<script>
import {
  getArticle, createArticle, updateArticle
} from "@/services/ArticleAPI";
import { getMovement } from "@/services/MovementAPI";
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

      { text: "Movimiento", value: "id_mov" },
      { text: "Producto", value: "id_producto" },
      { text: "Cantidad", value: "cantidad" },
      { text: "Valor", value: "valor" },
      { text: "Fecha de creación", value: `created_at` },
      { text: "Acciones", value: "actions" },
    ],
    loading: true,
    articles: [],
    movements: [],
    movement: "",
    editedIndex: -1,
    editedItem: {
      id: 0,
      id_producto: "",
      cantidad: 0,
      valor: 0,
      id_mov: {
        id: 0,
        descripcion: ""
      }
    },
    defaultItem: {
      id: 0,
      id_producto: "",
      cantidad: 0,
      valor: 0,
      id_mov: {
        id: 0,
        descripcion: ""
      }
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
        ? "Agregar nuevo articulo movimiento"
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
    this.getArticles();
    this.listArticles();
  },

  methods: {
    async getArticles() {
      let response = await getArticle();
      this.articles = response.data;
      this.loading = false;
      console.log(JSON.parse(JSON.stringify(this.articles)))
    },
    async listArticles() {
      let response = await getMovement();
      this.movements = response.data;
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
        "id_mov",
        "id_producto",
        "cantidad",
        "valor",
        "created_at",
      ]);

      var doc = new jsPDF({ putOnlyUsedFonts: true, orientation: "landscape" });
      doc.table(1, 1, JSON.parse(JSON.stringify(this.articles)), headers);
      doc.save('articulo.pdf')
    },


    editItem(item) {
      this.editedIndex = this.articles.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.articles.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      /* await deleteMovement(this.editedItem.id); */
      this.getArticles();
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
        await updateArticle(this.editedItem.id, this.editedItem);
        this.getArticles();
      } else {
        await createArticle({
          id_mov: this.movement.id,
          id_producto: this.editedItem.id_producto,
          cantidad: this.editedItem.cantidad,
          valor: this.editedItem.valor,
        }); 
        this.getArticles();
      }
      this.close();
    },
  },
};
</script>