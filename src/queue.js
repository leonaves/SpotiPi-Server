module.exports = (function()
{
    var queue = [];

    function get() {
        return queue;
    }

    function add(track) {
        queue.push(track);
        return queue;
    }

    return {
        get: get,
        add: add
    }
})();