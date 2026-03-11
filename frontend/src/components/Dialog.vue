<template>
    <v-dialog 
        :model-value="props.modelValue" 
        :max-width="props.maxWidth"
        @update:model-value="emit('update:modelValue', $event)"
        >
        <v-card>
            <v-card-title>
                <slot name="title"></slot>
            </v-card-title>

            <v-card-text>
                <slot></slot>
            </v-card-text>

            <v-card-actions v-if="$slots.actions">
                <slot name="actions">
                </slot>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>

const props = defineProps({
    modelValue: Boolean,
    maxWidth: {
        type: Number,
        default: 500
    }
})

const emit = defineEmits(['update:modelValue'])


</script>