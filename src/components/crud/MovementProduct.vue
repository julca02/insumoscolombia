<template>
  <v-data-table
    :headers="headers"
    :items="movimiento"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Movimientos</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="#1E8449" dark class="mb-2" v-bind="attrs" v-on="on">
              Nuevo movimiento
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
                      v-model="editedItem.codigo_mov"
                      label="Codigo del movimiento"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      v-model="tipo"
                      label="Tipo"
                      :items="tipos"
                      :menu-props="{ top: true, offsetY: true }"
                      return-object
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.cedula_mov"
                      label="Cedula del comprador"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.nombre_mov"
                      label="Nombre del comprador"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.valor_total_mov"
                      label="Valor total"
                    ></v-text-field>
                  </v-col>
                  
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancelar </v-btn>
              <v-btn color="blue darken-1" text @click="save"> Guardar </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Seguro quieres borrar este movimiento?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
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
      <v-icon small class="mr-2" @click="editItem(item)" color="blue"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)" color="red"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="getLine"> Reiniciar </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import { getMovement } from "@/services/MovementAPI";
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "ID",
        align: "start",
        value: "id",
      },
      { text: "Codigo", value: "codigo" },
      { text: "Descripcion", value: "descripcion" },
      { text: "Descripcion", value: "descripcion" },
      { text: "Movimiento", value: "tipo_mov" },
      { text: "Cedula", value: "ceduala_move" },
      { text: "Nombre", value: "nombre_mov" },
        { text: "Fecha de creación", value: `created_at` },
      { text: "Valor", value: "valor_total_mov" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    loading: true,
    movimiento: [],
    tipo: [],
    editedIndex: -1,
    editedItem: {
      id: 0,
      codigo: 0,
      descripcion: "",
    },
    defaultItem: {
      id: 0,
      codigo: 0,
      descripcion: "",
    },

    tipos: ['Entrada', 'Salida']
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
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
    this.getMovement();
  },

  methods: {
    async getMovement() {
      let response = await getMovement();
      this.linea = response.data;
      this.loading = false;
    },

    editItem(item) {
      this.editedIndex = this.linea.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.linea.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.linea.splice(this.editedIndex, 1);
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
        
        this.getLine();
      } else {
       
        this.getLine();
      }
      this.close();
    },
  },
};
</script>