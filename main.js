import {
  AddInfo,
  getmyinfo,
  PushMessage,
  ReadMessageRaw,
  GetInfoData,
  deleteMessage,
} from "./firebase_db.js";
import {
  signin_firebase,
  signout_firebase,
  signup_firebase,
} from "./firebase_auth.js";
import { MESSAGES_KEY, INFO_KEY } from "./firebase_config.js";
import { addItem, set_header_txt, load_messages } from "./chat.js";
import { goToNext, goToPrevious } from "./pageflip.js";
import { load_info, set_info_variables,close_info_box_layout } from "./infobox.js";
const admin_uid = "7Z8pzwRY4bOfWbtDt88PFOZ7hDD3";
export let account_uid = "";
export let selected_uid = "";
let myfirstname = "";

export function reload_messages() {
  //reload_my_msgbox(MESSAGES_KEY, account_uid);
  //get_messages(MESSAGES_KEY, account_uid);
  get_messages_raw(MESSAGES_KEY, account_uid);
}

export async function get_messages_raw(input_message_key, input_uid) {
  const data = await ReadMessageRaw(input_message_key, input_uid);

  let msgObj = [];
  if (data != null) {
    Object.keys(data).forEach((key) => {
      msgObj.push({ id: key, text: data[key] }); // Store message ID and text
    });
    load_messages(msgObj);
  } else {
    load_messages(null);
  }
}

window.DeleteMessage = async (messageId) => {
  if (account_uid != selected_uid) {
    alert("Not allowed!");
  } else {
    const success = await deleteMessage(messageId, account_uid);
    if (success) {
      get_messages_raw(MESSAGES_KEY, account_uid);
    }
  }

  //alert("Test 123");

  //loadMessages(); // Refresh messages after deletion
};
/*
document.addEventListener("DOMContentLoaded", function () {
  load_messages([]);
});
*/
/*
function load_messages(msgobj) {
  const container = document.getElementById("messagesContainer");
  container.innerHTML = ""; // Clear previous messages

  let msgObj = [];
  msgObj = msgobj;
  if (msgobj != null) {
    msgObj.forEach((msg) => {
      const messageDiv = document.createElement("div");
      messageDiv.innerHTML = `
          <p>${msg.text} <button onclick="DeleteMessage('${msg.id}')">🗑️</button></p>
        `;
      container.appendChild(messageDiv);

      //load_messages(msg.text,msg.id);
    });
  } else {
    container.innerHTML = "";
  }
}
  */
function loadPage(page) {
  fetch(page)
    .then((response) => response.text())
    .then((data) => {
      if (page === "infobox.html") {
        document.getElementById("info_disp").innerHTML = data;
        load_info();
      } else {
        document.getElementById("displ").innerHTML = data;
      }

      if (page === "chat.html") {
        if (account_uid === admin_uid) {
          DownLoadContacts(); //load drop down items
        }

        reload_messages(); // load messages
        get_my_info(INFO_KEY, account_uid); //get user name and display it
        document
          .getElementById("emailDropdown")
          .addEventListener("change", function () {
            let selectedOption = this.options[this.selectedIndex];
            if (selectedOption.value != null) {
              selected_uid = selectedOption.value;
              get_messages_raw(MESSAGES_KEY, selected_uid);
            }
          });

        const draggable = document.getElementById("draggable");
        let offsetX,
          offsetY,
          isDragging = false;

        draggable.addEventListener("mousedown", (e) => {
          isDragging = true;
          offsetX = e.clientX - draggable.offsetLeft;
          offsetY = e.clientY - draggable.offsetTop;
          draggable.style.cursor = "grabbing";
        });

        document.addEventListener("mousemove", (e) => {
          if (isDragging) {
            draggable.style.left = e.clientX - offsetX + "px";
            draggable.style.top = e.clientY - offsetY + "px";
          }
        });

        document.addEventListener("mouseup", () => {
          isDragging = false;
          draggable.style.cursor = "grab";
        });

        const inputField = document.getElementById("inputmsg");
        inputField.addEventListener("keydown", function (event) {
          if (event.key === "Enter" && inputField.value.trim() !== "") {
            let msg = inputField.value;

            // alert(account_uid);
            msg = myfirstname + ": " + msg;
            PushMessage(MESSAGES_KEY, selected_uid, msg);
            inputField.value = ""; // Clear input field after sending
          }
        });
      } else if (page === "signin.html") {
        const inputField1 = document.getElementById("signin_password");
        inputField1.addEventListener("keydown", function (event) {
          if (event.key === "Enter" && inputField1.value.trim() !== "") {
            SignInAccount();
          }
        });
      }
    })
    .catch((error) => console.error("Error loading page:", error));
}

const draggable1 = document.getElementById("draggable1");
let offsetX1,
  offsetY1,
  isDragging1 = false;

draggable1.addEventListener("mousedown", (e) => {
  isDragging1 = true;
  offsetX1 = e.clientX - draggable1.offsetLeft;
  offsetY1 = e.clientY - draggable1.offsetTop;
  draggable1.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
  if (isDragging1) {
    draggable1.style.left = e.clientX - offsetX1 + "px";
    draggable1.style.top = e.clientY - offsetY1 + "px";
  }
});

document.addEventListener("mouseup", () => {
  isDragging1 = false;
  draggable1.style.cursor = "grab";
});

async function DownLoadContacts() {
  const success = await GetInfoData(INFO_KEY);
  if (success != null) {
    const usersData = success;
    addItem("Select contacts", null);
    for (const [uid, data] of Object.entries(usersData)) {
      const infoArray = data.info.split(","); // Convert string to array
      const email = infoArray[2]; // Extract email
      addItem(email, uid);
    }
  }
}

async function signUpAndLoad(input_email, input_password) {
  const success = await signup_firebase(input_email, input_password); // Wait for the function to resolve
  if (success != null) {
    // If it resolves to true

    return success;
  } else {
    return null;
  }
}

async function signInAndLoad(input_email, input_password) {
  const success = await signin_firebase(input_email, input_password); // Wait for the function to resolve
  return success;
}

function check_credential_signup(
  input_fname,
  input_lname,
  input_email,
  input_password1,
  input_password2
) {
  let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  let namePattern = /^[A-Za-z ]{2,}$/;

  if (namePattern.test(input_fname)) {
  } else {
    alert("invalid first name!");
    return false;
  }
  if (namePattern.test(input_lname)) {
  } else {
    alert("invalid Last name!");

    return false;
  }

  if (input_email != null && emailPattern.test(input_email)) {
  } else {
    alert("email incorrect!");
    return false;
  }
  if (input_password1 == null) {
    alert("Empty password!");
    return false;
  }
  if (input_password2.length < 6) {
    alert("Password must be at 6 characters.");

    return false;
  }
  if (input_password1 === input_password2) {
    return true;
  } else {
    alert("Password dont match!");
    return false;
  }
}

function check_credential_signin(input_email, input_password) {
  let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(input_email)) {
    set_info_variables("Incorrect email format", "Check your email input","linear-gradient(135deg,rgb(3, 1, 2),rgb(236, 53, 114))");
    document.getElementById("info_disp").style.display = "flex";
    loadPage("infobox.html");
    return false;
  }
  if (input_password.length < 6) {
    set_info_variables("Incorrect password input", "Password must be atleast 6 characters","linear-gradient(135deg,rgb(3, 1, 2),rgb(236, 53, 114))");
    document.getElementById("info_disp").style.display = "flex";
    loadPage("infobox.html");
    return false;
  }
  return true;
}

function SignInAccount() {
  let signin_email = document.getElementById("signin_email").value;
  let signin_password = document.getElementById("signin_password").value;

  if (check_credential_signin(signin_email, signin_password)) {
    signInAndLoad(signin_email, signin_password)
      .then((RESULTS) => {
        if (RESULTS.toLowerCase().includes("error")) {
          let parts = RESULTS.split(",");
          if (parts.length > 1) {
            // alert(parts[1]);
           
            set_info_variables("Error signin", parts[1],"linear-gradient(135deg,rgb(3, 1, 2),rgb(236, 53, 114))");
            document.getElementById("info_disp").style.display = "flex";
            loadPage("infobox.html");

            //
          }
        } else {
          close_info_box_layout();
         // alert(RESULTS);
          account_uid = RESULTS;
          loadPage("chat.html");
          // DownLoadInfoData();
          //get_my_info(INFO_KEY, account_uid);
          selected_uid = account_uid;
          // get_name(INFO_KEY, account_uid);
          // alert(myname);
          //alert("Welcome");
        }
        /*
        if (RESULTS) {
         

          // ReadMessage(MESSAGES_KEY, account_uid);
        } else {
          loadPage("infobox.html");
          document.getElementById("info_disp").style.display = "flex";
        }
        */
      })
      .catch((error) => {
        console.error("Sign-in error:", error);
      });
  }
}

const circle1 = document.getElementById("circle1");
const circle2 = document.getElementById("circle2");
const circle3 = document.getElementById("circle3");
const circle4 = document.getElementById("circle4");
const circle5 = document.getElementById("circle5");
const circle6 = document.getElementById("circle6");

// Initial positions
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let pos1 = { x: mouse.x, y: mouse.y };
let pos2 = { x: mouse.x, y: mouse.y };
let pos3 = { x: mouse.x, y: mouse.y };
let pos4 = { x: mouse.x, y: mouse.y };
let pos5 = { x: mouse.x, y: mouse.y };
let pos6 = { x: mouse.x, y: mouse.y };

// Listen to mouse movement
document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX + 50; //move circles 10px to x
  mouse.y = e.clientY + 50; //move cicles 10px to y
});

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

function animate() {
  // Smoothly interpolate positions
  pos1.x = lerp(pos1.x, mouse.x, 0.05);
  pos1.y = lerp(pos1.y, mouse.y, 0.05);
  pos2.x = lerp(pos2.x, pos1.x, 0.05);
  pos2.y = lerp(pos2.y, pos1.y, 0.05);
  pos3.x = lerp(pos3.x, pos2.x, 0.05);
  pos3.y = lerp(pos3.y, pos2.y, 0.05);
  pos4.x = lerp(pos4.x, pos3.x, 0.05);
  pos4.y = lerp(pos4.y, pos3.y, 0.05);
  pos5.x = lerp(pos5.x, pos4.x, 0.05);
  pos5.y = lerp(pos5.y, pos4.y, 0.05);
  pos6.x = lerp(pos6.x, pos5.x, 0.05);
  pos6.y = lerp(pos6.y, pos5.y, 0.05);

  // Update element positions
  circle1.style.transform = `translate(${pos1.x}px, ${pos1.y}px)`;
  circle2.style.transform = `translate(${pos2.x}px, ${pos2.y}px)`;
  circle3.style.transform = `translate(${pos3.x}px, ${pos3.y}px)`;
  circle4.style.transform = `translate(${pos4.x}px, ${pos4.y}px)`;
  circle5.style.transform = `translate(${pos5.x}px, ${pos5.y}px)`;
  circle6.style.transform = `translate(${pos6.x}px, ${pos6.y}px)`;

  requestAnimationFrame(animate);
}

animate();

function side_bar_control() {
  const toggleBtn = document.getElementById("toggleBtn");
  const sidebar = document.getElementById("sidebar");
  if (sidebar.classList.contains("sidebar_open")) {
    sidebar.classList.remove("sidebar_open");
  } else {
    sidebar.classList.add("sidebar_open");
  }
}

function show_projects() {

//  const project_title = document.getElementById("show_proj");
  const page_open=document.getElementById("project_page");
  if (page_open.classList.contains("book_open")) {
    page_open.classList.remove("book_open");
  } else {
    page_open.classList.add("book_open");
  }
}


document.addEventListener("click", function (event) {
  if (event.target && event.target.id === "openForm") {
    // alert("hello");
    loadPage("signin.html");
    side_bar_control();
    document.getElementById("displ").style.display = "flex";
  } else if (event.target && event.target.id === "close_info_box_btn") {
  close_info_box_layout();
  } else if (event.target && event.target.id === "showproj_btn") {
    show_projects();
    }else if (event.target && event.target.id === "closeSignin") {
    document.getElementById("displ").style.display = "none";
  } else if (event.target && event.target.id === "page_flip_button_next") {
    goToNext();
  } else if (event.target && event.target.id === "page_flip_button_prev") {
    goToPrevious();
  } else if (event.target && event.target.id === "openSignup") {
    loadPage("signup.html");
    document.getElementById("displ").style.display = "flex";
  } else if (event.target && event.target.id === "closeSignup") {
    document.getElementById("displ").style.display = "none";
    document.getElementById("displ").innerHTML = "";
  } else if (event.target && event.target.id === "signinbtn") {
    //document.getElementById("signinbtn").disabled=true;
    set_info_variables("Signin in", "Please wait.","linear-gradient(135deg,rgb(63, 11, 37),rgb(236, 53, 114))");
    document.getElementById("info_disp").style.display = "flex";
    loadPage("infobox.html")
    SignInAccount();
  } else if (event.target && event.target.id === "toggleBtn") {
    side_bar_control();
  } else if (event.target && event.target.id === "signupbtn") {
    let myfname = document.getElementById("RFname").value;
    let mylname = document.getElementById("RLname").value;
    let signup_email = document.getElementById("REmail").value;
    let signup_password1 = document.getElementById("Rpassword1").value;
    let signup_password2 = document.getElementById("Rpassword2").value;

    if (
      check_credential_signup(
        myfname,
        mylname,
        signup_email,
        signup_password1,
        signup_password2
      ) === true
    ) {
      set_info_variables("Registering","Please wait...","linear-gradient(135deg,rgb(3, 1, 2),rgb(236, 53, 114))");
      document.getElementById("info_disp").style.display = "flex";
      loadPage("infobox.html");
      signUpAndLoad(signup_email, signup_password2)
        .then((USER_ID) => {
          if (USER_ID) {
            //  account_uid = USER_ID;
            close_info_box_layout();
            set_info_variables("Congratulations","You can now signin.","linear-gradient(135deg,rgb(3, 1, 2),rgb(236, 53, 114))");
            document.getElementById("info_disp").style.display = "flex";
            loadPage("infobox.html");
            AddInfo(INFO_KEY, myfname, mylname, signup_email, USER_ID);
            loadPage("signin.html");
          } else {
             set_info_variables("Signup failed", "Please try again later.","linear-gradient(135deg,rgb(3, 1, 2),rgb(236, 53, 114))");
            document.getElementById("info_disp").style.display = "flex";
            loadPage("infobox.html");
          }
        })
        .catch((error) => {
          console.error("Sign-in error:", error);
        });
    }
  } else if (event.target && event.target.id === "sendMsgBtn") {
    let msg = document.getElementById("inputmsg").value;
    // alert(account_uid);
    msg = myfirstname + ": " + msg;
    PushMessage(MESSAGES_KEY, selected_uid, msg);
    document.getElementById("inputmsg").value = "";
  } else if (event.target && event.target.id === "closechatbtn") {
    SignOut_FireBase()
      .then((RESULTS) => {
        if (RESULTS != null) {
          // alert(RESULTS + " " + myfirstname + " Come again!");

          document.getElementById("displ").style.display = "none";
          document.getElementById("displ").innerHTML = "";
          document.getElementById("info_disp").innerHTML = "";
          set_info_variables("Bye, "+myfirstname, "Come again thank you!","linear-gradient(135deg,rgb(3, 1, 2),rgb(236, 53, 114))");
          document.getElementById("info_disp").style.display = "flex";
          loadPage("infobox.html");
        } else {
          alert("failed signout");
        }
      })
      .catch((error) => {
        console.error("Sign-in error:", error);
      });
  } else if (event.target && event.target.id === "readmsgbtn") {
    get_data(MESSAGES_KEY, account_uid);
  } else if (event.target && event.target.id === "search_email_uid_btn") {
    let signin_email = document.getElementById("signin_email").value;
    search_uid_by_email(signin_email)
      .then((RESULTS) => {
        if (RESULTS) {
          alert(RESULTS);
        } else {
          alert("Failed to get data!");
        }
      })
      .catch((error) => {
        console.error("Sign-in error:", error);
      });
  }
});
/*
function get_name(input_key, input_uid) {
  get_my_info(input_key, input_uid)
    .then((RESULTS) => {
      if (RESULTS) {
        let dataStr = RESULTS;
        let arr = dataStr.split(",").map((item) => item.trim());
        if (arr.length === 3) {
          myfirstname = arr[0];
          alert("Welcome " + arr[0] + " " + arr[1]);
        }
      } else {
        alert("Failed to get data!");
      }
    })
    .catch((error) => {
      console.error("Sign-in error:", error);
    });
}

  */
/*
 function reload_my_msgbox(input_key, input_uid) {
  get_messages(input_key, input_uid)
    .then((RESULTS) => {
      if (RESULTS != null) {
        document.getElementById("message_box").value = RESULTS;
      } else {
        alert("Failed to get data!");
      }
    })
    .catch((error) => {
      console.error("Sign-in error:", error);
    });
}
*/

async function get_my_info(input_info_key, input_uid) {
  const success = await getmyinfo(input_info_key, input_uid);
  if (success != null) {
    // return success;
    let dataStr = success;
    let arr = dataStr.split(",").map((item) => item.trim());
    if (arr.length === 3) {
      myfirstname = arr[0];
      //  alert("Welcome " + arr[0] + " " + arr[1]);
      set_header_txt("Welcome " + arr[0] + " " + arr[1]);
    }
  }
}

async function SignOut_FireBase() {
  const success = await signout_firebase();
  if (success != null) {
    return success;
  } else {
    return null;
  }
}

async function search_uid_by_email(input_email) {
  const success = await findUidByEmail(input_email);
  if (success != null) {
    return success;
  } else {
    return null;
  }
}
document.getElementById('toggleBtn').addEventListener('mouseover', () => {
 side_bar_control();
});

document.getElementById('showproj_btn').addEventListener('mouseover', () => {
  show_projects();
 });