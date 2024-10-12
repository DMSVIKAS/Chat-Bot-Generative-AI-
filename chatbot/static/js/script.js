$(document).ready(function () {
    $('#send-button').click(function () {
        sendMessage();
    });

    $('#message-input').keypress(function (e) {
        if (e.which == 13) {
            sendMessage();
        }
    });

    function sendMessage() {
        var userMessage = $('#message-input').val().trim();
        if (userMessage) {
            $('#chat-body').append('<div class="user-prompt"><strong>User:</strong> ' + userMessage + '</div>');
            $('#message-input').val("");
            $('#chat-body').scrollTop($('#chat-body')[0].scrollHeight);
            $('#history').append('<div class="user-prompt"><strong>User:</strong> ' + userMessage + '</div>');

            $.ajax({
                url: '/chat',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ "message": userMessage }),
                success: function (response) {
                    $('#chat-body').append(
                        '<div class="chatbot-response">' +
                            '<strong>Chatbot:</strong> ' +
                            '<p>' + response.response + '</p>' +
                            '<button class="copy-btn" onclick="copyResponse(this)">Copy</button>' +
                        '</div>'
                    );
                    $('#chat-body').scrollTop($('#chat-body')[0].scrollHeight);
                    $('#history').append(
                        '<div class="chatbot-response">' +
                            '<strong>Chatbot:</strong> ' + response.response +
                        '</div>'
                    );
                },
                error: function (xhr, status, error) {
                    console.error("Error: " + error);
                }
            });
        }
    }

    window.copyResponse = function(button) {
        const responseText = $(button).siblings('p').text();
        navigator.clipboard.writeText(responseText).then(() => {
            button.innerText = "Copied!";
            setTimeout(() => {
                button.innerText = "Copy";
            }, 2000);
        }).catch((error) => {
            console.error('Error copying text:', error);
        });
    }

    $('#mode-toggle').change(function() {
        $('body').toggleClass('dark-mode');
    });
});
