document.addEventListener("DOMContentLoaded", () => {

    const body = document.body;

    const themeToggle = document.getElementById("themeToggle");

    const projectsStage = document.getElementById("projectsStage");

    const previousProject = document.getElementById("previousProject");
    const nextProject = document.getElementById("nextProject");

    const currentProject = document.getElementById("currentProject");
    const totalProjects = document.getElementById("totalProjects");

    const projectDialog = document.getElementById("projectDialog");

    const dialogClose = document.getElementById("dialogClose");

    const dialogIcon = document.getElementById("dialogIcon");
    const dialogCategory = document.getElementById("dialogCategory");
    const dialogTitle = document.getElementById("dialogTitle");
    const dialogDescription = document.getElementById("dialogDescription");
    const dialogLink = document.getElementById("dialogLink");

    const filterButtons = document.querySelectorAll(".filter-button");


    let currentFilter = "all";

    let filteredProjects = [...projects];

    let currentIndex = 0;


    function initializeIcons() {
        if (window.lucide) {
            lucide.createIcons();
        }
    }


    function updateThemeIcon() {

        const isLight = body.classList.contains("light");

        themeToggle.innerHTML = isLight
            ? '<i data-lucide="moon"></i>'
            : '<i data-lucide="sun"></i>';

        themeToggle.setAttribute(
            "aria-label",
            isLight
                ? "Cambiar a modo oscuro"
                : "Cambiar a modo claro"
        );

        initializeIcons();
    }


    function loadTheme() {

        const savedTheme = localStorage.getItem("portfolio-theme");

        if (savedTheme === "light") {
            body.classList.add("light");
        } else {
            body.classList.remove("light");
        }

        updateThemeIcon();
    }


    themeToggle.addEventListener("click", () => {

        body.classList.toggle("light");

        const isLight = body.classList.contains("light");

        localStorage.setItem(
            "portfolio-theme",
            isLight ? "light" : "dark"
        );

        updateThemeIcon();
    });


    function getFilteredProjects() {

        if (currentFilter === "all") {
            return [...projects];
        }

        return projects.filter(
            project => project.filter === currentFilter
        );
    }


    function renderProjects() {

        filteredProjects = getFilteredProjects();

        if (filteredProjects.length === 0) {

            projectsStage.innerHTML = `
                <div class="empty-projects">
                    No hay proyectos en esta categoría.
                </div>
            `;

            currentProject.textContent = "00";
            totalProjects.textContent = "00";

            return;
        }


        if (currentIndex >= filteredProjects.length) {
            currentIndex = 0;
        }


        projectsStage.innerHTML = "";


        filteredProjects.forEach((project, index) => {

            const card = document.createElement("article");

            card.className = "project-card";

            card.dataset.index = index;
            card.dataset.project = project.id;

            const rotation =
                index === currentIndex
                    ? 0
                    : index % 2 === 0
                        ? -4
                        : 4;

            card.style.setProperty(
                "--rotation",
                `${rotation}deg`
            );


            const isActive = index === currentIndex;

            card.style.opacity = isActive ? "1" : "0";

            card.style.pointerEvents = isActive
                ? "auto"
                : "none";


            card.innerHTML = `
                <div class="card-top">

                    <span class="card-number">
                        ${String(index + 1).padStart(2, "0")}
                    </span>

                    <div class="card-icon">
                        <i data-lucide="${project.icon}"></i>
                    </div>

                </div>


                <div class="card-category">
                    ${project.category}
                </div>


                <h3>
                    ${project.title}
                </h3>


                <p class="card-description">
                    ${project.description}
                </p>


                <div class="card-actions">

                    <a
                        href="${project.link}"
                        class="open-project"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Abrir proyecto
                        <i data-lucide="external-link"></i>
                    </a>

                </div>
            `;


            projectsStage.appendChild(card);

        });


        updateProjectPosition();

        initializeIcons();

        animateCards();
    }


    function animateCards() {

        const cards =
            document.querySelectorAll(".project-card");


        cards.forEach((card, index) => {

            const distance =
                index - currentIndex;

            if (distance === 0) {

                card.style.opacity = "1";
                card.style.pointerEvents = "auto";
                card.style.zIndex = "10";

                card.style.transform =
                    "translate(-50%, -50%) rotate(0deg)";

            } else {

                card.style.opacity = "0";
                card.style.pointerEvents = "none";
                card.style.zIndex = "1";

            }

        });

    }


    function updateProjectPosition() {

        const total = filteredProjects.length;

        if (total === 0) {
            return;
        }

        currentProject.textContent =
            String(currentIndex + 1).padStart(2, "0");

        totalProjects.textContent =
            String(total).padStart(2, "0");
    }


    function openProjectDialog(project) {

        dialogCategory.textContent =
            project.category;

        dialogTitle.textContent =
            project.title;

        dialogDescription.textContent =
            project.description;

        dialogLink.href =
            project.link;

        dialogIcon.innerHTML = `
            <i data-lucide="${project.icon}"></i>
        `;

        initializeIcons();


        if (typeof projectDialog.showModal === "function") {
            projectDialog.showModal();
        }
    }


    function closeProjectDialog() {

        if (projectDialog.open) {
            projectDialog.close();
        }

    }


    previousProject.addEventListener("click", () => {

        if (filteredProjects.length === 0) {
            return;
        }

        currentIndex--;

        if (currentIndex < 0) {
            currentIndex =
                filteredProjects.length - 1;
        }

        renderProjects();

    });


    nextProject.addEventListener("click", () => {

        if (filteredProjects.length === 0) {
            return;
        }

        currentIndex++;

        if (currentIndex >= filteredProjects.length) {
            currentIndex = 0;
        }

        renderProjects();

    });


    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            currentFilter =
                button.dataset.filter;

            currentIndex = 0;

            renderProjects();

        });

    });


    projectsStage.addEventListener("click", event => {

        const card =
            event.target.closest(".project-card");

        if (!card) {
            return;
        }


        const link =
            event.target.closest(".open-project");


        if (link) {
            return;
        }


        const project =
            filteredProjects[
            Number(card.dataset.index)
            ];


        if (project) {
            openProjectDialog(project);
        }

    });


    dialogClose.addEventListener(
        "click",
        closeProjectDialog
    );


    projectDialog.addEventListener(
        "click",
        event => {

            if (event.target === projectDialog) {
                closeProjectDialog();
            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {
                closeProjectDialog();
            }

        }
    );


    document.querySelectorAll(
        'a[href^="#"]'
    ).forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }


            const target =
                document.querySelector(targetId);


            if (!target) {
                return;
            }


            event.preventDefault();


            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    loadTheme();

    renderProjects();

    initializeIcons();

});