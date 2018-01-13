<script>
export default {
    props: {
        size: Number,
        color: String
    },
    computed: {
        spinnerColor() {
            return this.color || this.$parent.color || '#ccc';
        },
        spinnerSize() {
            return (this.size || this.$parent.size || 28) + 'px';
        }
    }
}
</script>
