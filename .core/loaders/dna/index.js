module.exports = function(content) {
    return `${content}
        require('dna').register(module);
    `;
};
