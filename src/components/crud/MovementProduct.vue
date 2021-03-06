<template>
  <v-data-table :search="search" :headers="headers" :items="movimiento" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Movimientos</v-toolbar-title>
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
              color="#1E8449"
              rounded
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
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
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      v-model="select"
                      label="Tipo"
                      :items="items"
                      item-text="state"
                      item-value="abbr"
                      persistent-hint
                      return-object
                      single-line
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.cedula_mov"
                      label="Cedula del comprador"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.nombre_mov"
                      label="Nombre del comprador"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
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
              >Seguro quieres borrar este movimiento?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="#1E8449" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)" color="blue">
        mdi-pencil
      </v-icon>
      <v-icon small @click="deleteItem(item)" color="red"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="success" @click="getMovements"> Reiniciar </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import {
  getMovement,
  createMovement,
  updateMovement,
  deleteMovement,
} from "@/services/MovementAPI";
import { jsPDF } from "jspdf";
export default {
  data: () => ({
    dialog: false,
    search: "",
    dialogDelete: false,
    headers: [
      {
        text: "ID",
        align: "start",
        value: "id",
      },
      { text: "Movimiento", value: "tipo_mov" },
      { text: "Cedula", value: "cedula_mov" },
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
      cedula_mov: 0,
      nombre_mov: "",
      valor_total_mov: 0,
    },
    defaultItem: {
      id: 0,
      cedula_mov: 0,
      nombre_mov: "",
      valor_total_mov: 0,
    },
    select: { state: "Entrada", abbr: 0 },
    items: [
      { state: "Entrada", abbr: 0 },
      { state: "Salida", abbr: 1 },
    ],
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
    this.getMovements();
  },

  methods: {
    async getMovements() {
      let response = await getMovement();
      this.movimiento = response.data;
      this.loading = false;
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
        "tipo_mov",
        "cedula_mov",
        "nombre_mov",
        "valor_total_mov",
        "created_at",
      ]);

      var doc = new jsPDF({ putOnlyUsedFonts: true, orientation: "landscape" });
      doc.table(1, 1, JSON.parse(JSON.stringify(this.movimiento)), headers);
      doc.save('movement.pdf')
    },

    editItem(item) {
      this.editedIndex = this.movimiento.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.movimiento.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      await deleteMovement(this.editedItem.id);
      this.getMovements();
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
        const data = this.editedItem;
        const select = this.select.abbr;
        await updateMovement(this.editedItem.id, { ...data, tipo_mov: select });
        this.getMovements();
      } else {
        const data = this.editedItem;
        const select = this.select.abbr;
        await createMovement({ ...data, tipo_mov: select });
        this.getMovements();
      }
      this.close();
    },
  },
};
</script>