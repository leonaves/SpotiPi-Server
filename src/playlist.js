var queue = [];

exports.get = function (err) {
    return queue;
};

exports.add = function (track) {
    queue.push(track);

    return queue;
};
