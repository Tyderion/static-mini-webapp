document.addEventListener('DOMContentLoaded', function() {
    if (document.location.hash === '') {
        document.location.hash = 'home';
    } else {
        var radioButton = document.querySelector(document.location.hash);
        if (radioButton !== null) {
            radioButton.checked = true;
        } else {
            document.location.hash = 'home';
        }
    }
    var labels = document.querySelectorAll('label');
    for (var i = 0; i < labels.length; i++) {
        var label = labels[i];
        label.onclick = function(event) {
            document.location.hash = event.target.getAttribute('for');
        }
    }
});
