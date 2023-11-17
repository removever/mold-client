
<script lang="ts" setup>
import { UserPosition } from "~~/misc/types"

definePageMeta({ middleware: ["auth"] });
const { getUserPositionByID } = useUserPosition();

const user_position = ref<UserPosition>({
  user_position_id: '',
  user_position_name: '',
});

onMounted(async () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const query: { [key: number | string]: string } = {};

    for (const [key, value] of params) {
      query[key] = value;
    }

    user_position.value = await getUserPositionByID({ user_position_id: query.id })
  } catch (e) {
    console.log(e)
  }
})
</script>
<template>
  <v-breadcrumbs :items="[
    { title: 'ตำเเหน่ง', to: '/user-position', },
    { title: 'รายละเอียด', disabled: true, }
  ]">
    <template v-slot:title="{ item }">{{ item.title.toUpperCase() }}</template>
  </v-breadcrumbs>
  <v-card elevation="10" class="withbg">
    <v-card-text>
      <div class="d-sm-flex align-center  pt-sm-2">
        <v-card-title>รายละเอียด</v-card-title>
      </div>
      <v-container>
        <v-row>
          <v-col cols="12" md="8">
            <v-row>
              <v-col cols="12" sm="6" lg="2">
                <v-label>รหัสตำเเหน่ง</v-label>
              </v-col>
              <v-col cols="12" sm="6" lg="2">
                <v-label>{{ user_position.user_position_id }}</v-label>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" lg="2">
                <v-label>ชื่อตำเเหน่ง</v-label>
              </v-col>
              <v-col cols="12" sm="6" lg="2">
                <v-label>{{ user_position.user_position_name }}</v-label>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-text class="d-flex flex-wrap justify-center gap-2">
      <v-btn type="submit" color="muted" :to="'/user-position'">กลับ</v-btn>
    </v-card-text>
  </v-card>
</template>