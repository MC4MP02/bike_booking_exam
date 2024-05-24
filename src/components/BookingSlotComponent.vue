<script>
export default {
    props: ['bikeId', 'slotId', 'modelValue'],
    emits: ['update:modelValue'],
    data() {
        return {
            color: 'white',
        }
    },
    methods: {
        toggleBikeBooked() {
            if (this.color != 'gray' && this.color != 'red') {
                this.color = 'yellow';
                fetch(`http://localhost:3001/book?bikeId=${this.bikeId}&slotId=${this.slotId}`, {
                    methods: 'GET',
                })
                    .then(res => res.text())
                    .then(data => {
                        if (data == 'booked') {
                            this.$emit('update:modelValue', true);
                            this.color = 'green';
                        } else {
                            this.$emit('update:modelValue', false);
                            if (this.color == 'yellow') {
                                this.color = 'red';
                            }
                        }

                    })
            }
        }
    },
    computed: {
        bikeBooked() {
            if (this.modelValue && this.color == 'white') {
                this.color = 'gray';
                return 'gray';
            } else {
                return this.color
            }
        }
    }

}
</script>

<template>
    <span @click="toggleBikeBooked" :style="`background-color: ${bikeBooked}`">Bike: {{ bikeId }} Slot: {{ slotId
        }}</span>
</template>

<style></style>