const state = {
    filter: "all",
    projects: [...projects],
    currentIndex: 0
};

const projectStage = document.getElementById("projectsStage");
const projectPosition = document.getElementById("projectPosition");
const previousButton = document.getElementById("prevProject");
const nextButton = document.getElementById("nextProject");

const projectDialog = document.getElementById("projectDialog");
const dialogClose = document.getElementById("dialogClose");
const dialogCloseSecondary = document.getElementById("dialogCloseSecondary");

const themeToggle = document.getElementById("themeToggle");

function createIcons() {
    if (window.lucide) {
        lucide.createIcons();
    }
}

function getFilteredProjects() {
    if (state.filter === "all") {
        return projects;
    }

    return projects.filter(
        project => project.filter === state.filter
    );
}

function renderProjects() {
    state.projects = getFilteredProjects();

    if (state.projects.length === 0) {
        projectStage.innerHTML = `
            <div class="empty-projects">
                No hay proyectos en esta categoría.
            </div>
        `;

        projectPosition.textContent = "0 / 0";
        return;
    }

    if (state.currentIndex >= state.projects.length) {
        state.currentIndex = 0;
    }

    projectStage.innerHTML = state.projects
        .map((project, index) => {

            const number = String(index + 1).padStart(2, "0");

            return `
                <article
                    class="project-card ${index === state.currentIndex ? "active" : ""}"
                    data-index="${index}"
                    style="--offset: 0; --scale: 1;"
                >

                    <div class="card-number">
                        <span>${number}</span>
                        <span>PROJECT</span>
                    </div>

                    <div class="card-icon">
                        <i data-lucide="${project.icon}"></i>
                    </div>

                    <div class="card-content">

                        <p class="card-category">
                            ${project.category}
                        </p>

                        <h3 class="card-title">
                            ${project.title}
                        </h3>

                        <p class="card-description">
                            ${project.description}
                        </p>

                        <a
                            class="project-open"
                            href="${project.link}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Abrir proyecto
                            <i data-lucide="arrow-up-right"></i>
                        </a>

                    </div>

                </article>
            `;
        })
        .join("");

    updateProjectCards();
    createIcons();
}

function updateProjectCards() {
    const cards = [
        ...projectStage.querySelectorAll(".project-card")
    ];

    const total = state.projects.length;

    cards.forEach((card, index) => {

        let offset = index - state.currentIndex;

        if (offset > total / 2) {
            offset -= total;
        }

        if (offset < -total / 2) {
            offset += total;
        }

        const absoluteOffset = Math.abs(offset);

        let scale = 1 - Math.min(absoluteOffset * 0.07, 0.21);

        if (offset === 0) {
            scale = 1;
        }

        card.style.setProperty("--offset", offset);
        card.style.setProperty("--scale", scale);

        card.classList.toggle(
            "active",
            offset === 0
        );

        if (absoluteOffset > 2) {
            card.style.opacity = "0";
            card.style.pointerEvents = "none";
        } else {
            card.style.opacity =
                offset === 0 ? "1" : "0.58";

            card.style.pointerEvents =
                offset === 0 ? "auto" : "auto";
        }

        card.style.zIndex =
            String(100 - absoluteOffset);
    });

    projectPosition.textContent =
        `${state.currentIndex + 1} / ${total}`;
}

function nextProject() {
    if (!state.projects.length) {
        return;
    }

    state.currentIndex =
        (state.currentIndex + 1) %
        state.projects.length;

    updateProjectCards();
    createIcons();
}

function previousProject() {
    if (!state.projects.length) {
        return;
    }

    state.currentIndex =
        (state.currentIndex - 1 + state.projects.length) %
        state.projects.length;

    updateProjectCards();
    createIcons();
}

function openProject(project) {

    const dialogIcon =
        document.getElementById("dialogIcon");

    const dialogCategory =
        document.getElementById("dialogCategory");

    const dialogTitle =
        document.getElementById("dialogTitle");

    const dialogDescription =
        document.getElementById("dialogDescription");

    const dialogLink =
        document.getElementById("dialogLink");

    dialogIcon.setAttribute(
        "data-lucide",
        project.icon
    );

    dialogCategory.textContent =
        project.category;

    dialogTitle.textContent =
        project.title;

    dialogDescription.textContent =
        project.description;

    dialogLink.href =
        project.link;

    dialogLink.target =
        "_blank";

    dialogLink.rel =
        "noopener noreferrer";

    if (
        projectDialog &&
        typeof projectDialog.showModal === "function"
    ) {
        projectDialog.showModal();
    } else {
        projectDialog.setAttribute(
            "open",
            ""
        );
    }

    createIcons();
}

function closeProject() {
    if (
        projectDialog &&
        typeof projectDialog.close === "function" &&
        projectDialog.open
    ) {
        projectDialog.close();
    } else if (projectDialog) {
        projectDialog.removeAttribute("open");
    }
}

projectStage.addEventListener("click", event => {

    const projectLink =
        event.target.closest(".project-open");

    if (projectLink) {
        return;
    }

    const card =
        event.target.closest(".project-card");

    if (!card) {
        return;
    }

    const index =
        Number(card.dataset.index);

    if (
        index !== state.currentIndex
    ) {
        state.currentIndex = index;
        updateProjectCards();
        return;
    }

    const project =
        state.projects[index];

    if (project) {
        openProject(project);
    }
});

previousButton.addEventListener(
    "click",
    previousProject
);

nextButton.addEventListener(
    "click",
    nextProject
);

document
    .querySelectorAll(".filter-button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".filter-button")
                    .forEach(item => {
                        item.classList.remove("active");
                    });

                button.classList.add("active");

                state.filter =
                    button.dataset.filter;

                state.currentIndex = 0;

                renderProjects();
            }
        );
    });

dialogClose.addEventListener(
    "click",
    closeProject
);

dialogCloseSecondary.addEventListener(
    "click",
    closeProject
);

projectDialog.addEventListener(
    "click",
    event => {

        const rect =
            projectDialog.getBoundingClientRect();

        const clickedOutside =
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom;

        if (clickedOutside) {
            closeProject();
        }
    }
);

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {
            closeProject();
        }

        if (
            event.key === "ArrowRight" &&
            !projectDialog.open
        ) {
            nextProject();
        }

        if (
            event.key === "ArrowLeft" &&
            !projectDialog.open
        ) {
            previousProject();
        }
    }
);

function setTheme(theme) {

    const isLight =
        theme === "light";

    document.body.classList.toggle(
        "light-mode",
        isLight
    );

    themeToggle.setAttribute(
        "aria-pressed",
        String(isLight)
    );

    themeToggle.innerHTML = isLight
        ? `<i data-lucide="sun"></i>`
        : `<i data-lucide="moon"></i>`;

    localStorage.setItem(
        "portfolio-theme",
        theme
    );

    createIcons();
}

function initializeTheme() {

    const savedTheme =
        localStorage.getItem(
            "portfolio-theme"
        );

    if (savedTheme) {
        setTheme(savedTheme);
        return;
    }

    const prefersLight =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-color-scheme: light)"
        ).matches;

    setTheme(
        prefersLight
            ? "light"
            : "dark"
    );
}

themeToggle.addEventListener(
    "click",
    () => {

        const isLight =
            document.body.classList.contains(
                "light-mode"
            );

        setTheme(
            isLight
                ? "dark"
                : "light"
        );
    }
);

renderProjects();
initializeTheme();
createIcons();