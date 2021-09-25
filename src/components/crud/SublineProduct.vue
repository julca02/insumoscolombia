<template>
  <v-data-table
    :headers="headers"
    :items="linea"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Sublinea</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="#1E8449" rounded dark class="mb-2" v-bind="attrs" v-on="on">
              Nueva sublinea
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
                      v-model="editedItem.codigo"
                      label="Codigo"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="8">
                    <v-textarea
                      clearable
                      clear-icon="mdi-close-circle"
                      :counter="256"
                      v-model="editedItem.descripcion"
                      label="Nueva descripción"
                      auto-grow
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancelar </v-btn>
              <v-btn color="#1E8449" text @click="save"> Guardar </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Deseas borrar esta sublinea?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancelar</v-btn
              >
              <v-btn color="#E74C3C" text @click="deleteItemConfirm"
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
      <v-icon small @click="deleteItem(item)"  color="#E57373"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="success" @click="getSubline"> Reiniciar </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import { getSubline, createSubline, updateSubline } from "@/services/SublineAPI";
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
      { text: "Fecha creación", value: "created_at" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    loading: true,
    linea: [],
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
    this.getLine();
  },

  methods: {
    async getLine() {
      let response = await getSubline();
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
        await updateSubline(this.editedItem.id, this.editedItem);
        this.getLine()
      } else {
        await createSubline(this.editedItem);
        this.getLine();
      }
      this.close();
    },
  },
};
</script>