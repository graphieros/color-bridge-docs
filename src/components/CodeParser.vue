<script setup>
import { useMainStore } from '@/stores/main';
import { computed } from 'vue';
import colorBridge from "color-bridge";

const props = defineProps({
    content: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
});

const store = useMainStore();
const highlightedCode = computed(() => highlightCode(props.content, props.language));

const { utils } = colorBridge();

const { lightenHexColor } = utils();

function highlightCode(code, language) {
    if (language === 'html') {
        const htmlTagPattern = /(<\/?)([a-zA-Z0-9-]+)([^<]*?)(\/?>)/g;
        code = code.replace(htmlTagPattern, (match, openingBracket, tagName, attributes, closingBracket) => {
            const highlightedTagName = `<span class="code-tag-name">${tagName}</span>`;
            return (
                `&lt;${openingBracket === '</' ? '/' : ''}` +
                highlightedTagName +
                attributes +
                `${closingBracket === '/>' ? ' /' : ''}&gt;`
            );
        });
    }


    else if (language === 'javascript') {
        const keywords = /\b(?:const|let|var|function|return|if|else|for|while|switch|case|break|continue|try|catch|throw|class|extends|import|export|default|new|async|await)\b/g;
        const vueSpecificTerms = /\b(?:ref|computed|watch|onMounted|onUnmounted|defineComponent|defineProps|defineEmits)\b/g;
        const functionNamePattern = /\b([a-zA-Z_]\w*)\s*(?=\()/g;
        const stringPattern = /(["'])(?:(?=(\\?))\2.)*?\1/g;
        const commentPattern = /(\/\*[\s\S]*?\*\/|\/\/.*)/g;

        const stringPlaceholders = [];
        const codeWithStrings = code.replace(stringPattern, (match) => {
            stringPlaceholders.push(match);
            return `__STRING_PLACEHOLDER_${stringPlaceholders.length - 1}__`;
        });

        const commentPlaceholders = [];
        const codeWithComments = codeWithStrings.replace(commentPattern, (match) => {
            commentPlaceholders.push(match);
            return `__COMMENT_PLACEHOLDER_${commentPlaceholders.length - 1}__`;
        });

        code = codeWithComments
            .replace(keywords, '<span class="code-keyword">$&</span>')
            .replace(vueSpecificTerms, '<span class="code-vue-term">$&</span>')
            .replace(functionNamePattern, '<span class="code-function">$1</span>');

        code = code.replace(/__COMMENT_PLACEHOLDER_(\d+)__/g, (_, index) => {
            const comment = commentPlaceholders[index];
            return `<span class="code-comment">${comment}</span>`;
        });

        code = code.replace(/__STRING_PLACEHOLDER_(\d+)__/g, (_, index) => {
            const string = stringPlaceholders[index];
            return `<span class="code-string">${string}</span>`;
        });
    }

    return code;
}

// store.codeTheme

const color_function = computed(() => store.codeTheme.caution);
const color_keyword = computed(() => store.codeTheme.energy);
const color_string = computed(() => lightenHexColor({ hexColor: store.codeTheme.luck, force: 0.2}));

</script>

<template>
    <pre v-html="highlightedCode" class="code-container"></pre>
</template>

<style scoped>
/* Code Container Styles */
.code-container {
    background-color: transparent;
    color: #abb2bf;
    padding-left: 15px;
    border-radius: 6px;
    overflow: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: 'Fira Code', monospace;
    font-size: 14px;
    overflow-y:hidden;
}

/* Keyword Styles */
::v-deep(.code-keyword) {
    color: v-bind(color_keyword);
    /* Purple */
    font-weight: bold;
}

/* Vue-specific terms (ref, computed) */
::v-deep(.code-vue-term) {
    color: #56b6c2;
    /* Cyan */
    font-weight: bold;
}

/* Function names */
::v-deep(.code-function) {
    color: v-bind(color_function);
    /* Light Blue */
}

/* Strings */
::v-deep(.code-string) {
    color: v-bind(color_string);
    /* Green */
}

/* Comments */
::v-deep(.code-comment) {
    color: #d87d71;
    /* Gray */
    font-style: italic;
}

/* HTML Tag Names */
::v-deep(.code-tag-name) {
    color: #e06c75;
    /* Red */
    font-weight: bold;
}
</style>
