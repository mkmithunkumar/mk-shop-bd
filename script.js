/* =========================================
   MK SHOP BD
   GOOGLE SHEET ORDER SYSTEM
========================================= */


/* =========================================
   GOOGLE APPS SCRIPT URL
========================================= */

const GOOGLE_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbxpsqd3ct0EaAFUrks6Wxrw11Z0_nIiPBv9ooS3doZIj8O3xY5NtJUcmogl3XjDNHtB/exec";


/* =========================================
   ORDER DATA
========================================= */

window.mkOrder = {

    name: "",

    phone: "",

    product: "",

    quantity: "",

    total: "",

    address: ""

};


/* =========================================
   CHAT STEP
========================================= */

window.mkStep = 0;


/* =========================================
   OPEN / CLOSE CHAT
========================================= */

function toggleMKChat() {

    const box =
        document.getElementById("mkChatBox");


    if (box.style.display === "flex") {

        box.style.display = "none";

    } else {

        box.style.display = "flex";

        document
            .getElementById("mkChatInput")
            .focus();

    }

}


/* =========================================
   ADD CHAT MESSAGE
========================================= */

function addMKMessage(message, type) {

    const messages =
        document.getElementById("mkChatMessages");


    const div =
        document.createElement("div");


    if (type === "user") {

        div.className =
            "mkUserMessage";

    } else {

        div.className =
            "mkBotMessage";

    }


    div.innerHTML = message;


    messages.appendChild(div);


    messages.scrollTop =
        messages.scrollHeight;

}


/* =========================================
   SEND MESSAGE
========================================= */

function sendMKMessage() {

    const input =
        document.getElementById("mkChatInput");


    const message =
        input.value.trim();


    if (!message) {

        return;

    }


    /* User message */

    addMKMessage(
        message,
        "user"
    );


    /* Clear input */

    input.value = "";


    /* Process message */

    setTimeout(function() {

        processMKMessage(message);

    }, 350);

}


/* =========================================
   PROCESS CHAT
========================================= */

function processMKMessage(message) {


    /* -------------------------------------
       STEP 0 - PRODUCT
    ------------------------------------- */

    if (window.mkStep === 0) {

        window.mkOrder.product =
            message;


        window.mkStep = 1;


        addMKMessage(

            "ঠিক আছে 👍<br><br>" +

            "কত কেজি/টি নিতে চান?",

            "bot"

        );


        return;

    }


    /* -------------------------------------
       STEP 1 - QUANTITY
    ------------------------------------- */

    if (window.mkStep === 1) {

        window.mkOrder.quantity =
            message;


        window.mkStep = 2;


        addMKMessage(

            "ধন্যবাদ। 😊<br><br>" +

            "আপনার নামটি লিখুন।",

            "bot"

        );


        return;

    }


    /* -------------------------------------
       STEP 2 - NAME
    ------------------------------------- */

    if (window.mkStep === 2) {

        window.mkOrder.name =
            message;


        window.mkStep = 3;


        addMKMessage(

            "ধন্যবাদ " +
            message +
            "। 😊<br><br>" +

            "আপনার মোবাইল নম্বরটি দিন।",

            "bot"

        );


        return;

    }


    /* -------------------------------------
       STEP 3 - PHONE
    ------------------------------------- */

    if (window.mkStep === 3) {

        window.mkOrder.phone =
            message;


        window.mkStep = 4;


        addMKMessage(

            "ঠিক আছে। 👍<br><br>" +

            "আপনার সম্পূর্ণ ঠিকানা লিখুন।",

            "bot"

        );


        return;

    }


    /* -------------------------------------
       STEP 4 - ADDRESS
    ------------------------------------- */

    if (window.mkStep === 4) {

        window.mkOrder.address =
            message;


        window.mkStep = 5;


        addMKMessage(

            "আপনার অর্ডারটি নেওয়া হচ্ছে... ⏳",

            "bot"

        );


        submitMKOrder();


        return;

    }

}


/* =========================================
   SEND ORDER TO GOOGLE SHEET
========================================= */

async function submitMKOrder() {

    try {


        const response =
            await fetch(

                GOOGLE_SCRIPT_URL,

                {

                    method: "POST",

                    body:
                        JSON.stringify(
                            window.mkOrder
                        )

                }

            );


        const result =
            await response.json();


        /* ---------------------------------
           SUCCESS
        --------------------------------- */

        if (result.success) {


            addMKMessage(

                "✅ <b>অর্ডার সফল হয়েছে!</b>" +

                "<br><br>" +

                "পণ্য: " +
                window.mkOrder.product +

                "<br>" +

                "পরিমাণ: " +
                window.mkOrder.quantity +

                "<br>" +

                "নাম: " +
                window.mkOrder.name +

                "<br>" +

                "মোবাইল: " +
                window.mkOrder.phone +

                "<br><br>" +

                "Order ID:<br>" +

                "<b>" +
                result.orderId +
                "</b>" +

                "<br><br>" +

                "আপনার অর্ডারটি আমাদের কাছে পৌঁছেছে। ❤️" +

                "<button " +

                "class='mkNewOrderButton' " +

                "onclick='startNewMKOrder()'>" +

                "🔄 নতুন অর্ডার করুন" +

                "</button>",

                "bot"

            );

        }


        /* ---------------------------------
           ERROR
        --------------------------------- */

        else {

            addMKMessage(

                "❌ <b>অর্ডার পাঠানো যায়নি।</b>" +

                "<br><br>" +

                "দয়া করে আবার চেষ্টা করুন।",

                "bot"

            );

        }


    } catch (error) {


        console.error(
            "MK SHOP ORDER ERROR:",
            error
        );


        addMKMessage(

            "❌ <b>অর্ডার পাঠাতে সমস্যা হয়েছে।</b>" +

            "<br><br>" +

            "ইন্টারনেট সংযোগ পরীক্ষা করে " +

            "আবার চেষ্টা করুন।",

            "bot"

        );

    }

}


/* =========================================
   START NEW ORDER
========================================= */

function startNewMKOrder() {


    /* Reset order */

    window.mkOrder = {

        name: "",

        phone: "",

        product: "",

        quantity: "",

        total: "",

        address: ""

    };


    /* Reset step */

    window.mkStep = 0;


    /* Clear messages */

    const messages =
        document.getElementById(
            "mkChatMessages"
        );


    messages.innerHTML = `

        <div class="mkBotMessage">

            নমস্কার! 🙏

            <br><br>

            MK SHOP BD-তে স্বাগতম।

            <br><br>

            আপনি কোন পণ্য অর্ডার করতে চান?

        </div>

    `;


    /* Clear input */

    const input =
        document.getElementById(
            "mkChatInput"
        );


    input.value = "";


    input.focus();

}


/* =========================================
   PRODUCT BUTTON
========================================= */

function selectProduct(
    productName,
    price
) {


    /* Open chat */

    const box =
        document.getElementById(
            "mkChatBox"
        );


    box.style.display = "flex";


    /* Save product */

    window.mkOrder.product =
        productName;


    window.mkOrder.total =
        price;


    /* Step 1 = quantity */

    window.mkStep = 1;


    /* Show message */

    const messages =
        document.getElementById(
            "mkChatMessages"
        );


    messages.innerHTML = `

        <div class="mkBotMessage">

            আপনি নির্বাচন করেছেন:

            <br><br>

            <strong>
                ${productName}
            </strong>

            <br>

            মূল্য:
            <strong>
                ৳${price} / kg
            </strong>

            <br><br>

            কত কেজি নিতে চান?

        </div>

    `;


    /* Focus input */

    document
        .getElementById(
            "mkChatInput"
        )
        .focus();

}


/* =========================================
   ENTER KEY
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {


        const input =
            document.getElementById(
                "mkChatInput"
            );


        if (input) {


            input.addEventListener(
                "keydown",
                function(event) {


                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        sendMKMessage();

                    }

                }
            );

        }

    }
);
