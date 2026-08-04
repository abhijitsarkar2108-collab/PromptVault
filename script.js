// PromptVault - Part 1

let prompts = JSON.parse(localStorage.getItem("prompts")) || [];
let editIndex = -1;

const titleInput = document.getElementById("title");
const promptInput = document.getElementById("prompt");
const saveBtn = document.getElementById("saveBtn");
const promptList = document.getElementById("promptList");
const searchInput = document.getElementById("searchInput");

const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupPrompt = document.getElementById("popupPrompt");

const copyBtn = document.getElementById("copyBtn");
const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");
const closePopup = document.getElementById("closePopup");

let currentIndex = -1;

renderPrompts();

saveBtn.addEventListener("click", savePrompt);

function savePrompt() {

    const title = titleInput.value.trim();
    const prompt = promptInput.value.trim();

    if (!title || !prompt) {
        alert("Please fill all fields.");
        return;
    }

    if (editIndex === -1) {

        prompts.unshift({
            title,
            prompt
        });

    } else {

        prompts[editIndex] = {
            title,
            prompt
        };

        editIndex = -1;
        saveBtn.textContent = "Save Prompt";

    }

    localStorage.setItem("prompts", JSON.stringify(prompts));

    titleInput.value = "";
    promptInput.value = "";

    renderPrompts();

}

function renderPrompts() {

    promptList.innerHTML = "";

    const keyword = searchInput.value.toLowerCase();

    prompts.forEach((item, index) => {

        if (!item.title.toLowerCase().includes(keyword)) return;

        const card = document.createElement("div");
        card.className = "prompt-card";

        card.innerHTML = `
            <h3>${item.title}</h3>
        `;

        card.addEventListener("click", () => {

            currentIndex = index;

            popupTitle.textContent = item.title;
            popupPrompt.value = item.prompt;

            popup.style.display = "flex";

        });

        promptList.appendChild(card);

    });

}

searchInput.addEventListener("input", renderPrompts);

// PromptVault - Part 2

closePopup.addEventListener("click", () => {
    popup.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === popup) {
        popup.style.display = "none";
    }
});

copyBtn.addEventListener("click", () => {

    navigator.clipboard.writeText(popupPrompt.value)
        .then(() => {
            copyBtn.textContent = "✅ Copied";

            setTimeout(() => {
                copyBtn.textContent = "📋 Copy";
            }, 1500);
        })
        .catch(() => {
            alert("Copy failed!");
        });

});

editBtn.addEventListener("click", () => {

    if (currentIndex < 0) return;

    titleInput.value = prompts[currentIndex].title;
    promptInput.value = prompts[currentIndex].prompt;

    editIndex = currentIndex;

    saveBtn.textContent = "Update Prompt";

    popup.style.display = "none";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});

deleteBtn.addEventListener("click", () => {

    if (currentIndex < 0) return;

    const confirmDelete = confirm(
        "Are you sure you want to delete this prompt?"
    );

    if (!confirmDelete) return;

    prompts.splice(currentIndex, 1);

    localStorage.setItem(
        "prompts",
        JSON.stringify(prompts)
    );

    popup.style.display = "none";

    renderPrompts();

});

// ===============================
// PromptVault - Part 3
// ===============================

// ---------- Export JSON ----------
function exportPrompts() {

    const data = JSON.stringify(prompts, null, 2);

    const blob = new Blob([data], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "PromptVault_Backup.json";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

}

// ---------- Import JSON ----------
function importPrompts(file) {

    const reader = new FileReader();

    reader.onload = function(e) {

        try {

            const imported = JSON.parse(e.target.result);

            if (!Array.isArray(imported)) {
                alert("Invalid backup file.");
                return;
            }

            prompts = imported;

            localStorage.setItem(
                "prompts",
                JSON.stringify(prompts)
            );

            renderPrompts();

            alert("Backup imported successfully.");

        } catch {

            alert("Import failed.");

        }

    };

    reader.readAsText(file);

}

// ---------- Keyboard Shortcut ----------
document.addEventListener("keydown", function(e){

    if(e.ctrlKey && e.key==="s"){

        e.preventDefault();

        savePrompt();

    }

});

// ---------- Auto Focus ----------
window.addEventListener("load",()=>{

    titleInput.focus();

});

// ---------- Total Prompt Counter ----------
function updateCounter(){

    let counter=document.getElementById("promptCounter");

    if(!counter){

        counter=document.createElement("p");

        counter.id="promptCounter";

        counter.style.marginBottom="15px";

        counter.style.fontWeight="600";

        promptList.parentNode.insertBefore(counter,promptList);

    }

    counter.innerHTML=`Total Prompts : ${prompts.length}`;

}

const oldRender=renderPrompts;

renderPrompts=function(){

    oldRender();

    updateCounter();

};

renderPrompts();
