document.addEventListener("DOMContentLoaded", () => {

    let currentProjects = [...projects];
    let currentIndex = 0;

    const stage = document.getElementById("projectsStage");
    const filters = document.querySelectorAll(".filter-button");

    const previousButton = document.getElementById("previousProject");
    const nextButton = document.getElementById("nextProject");
    const positionElement = document.getElementById("projectPosition");

    const dialog = document.getElementById("projectDialog");
    const dialogClose = document.getElementById("dialogClose");

    const dialogCategory = document.getElementById("dialogCategory");
    const dialogTitle = document.getElementById("dialogTitle");
    const dialogDescription = document.getElementById("dialogDescription");
    const dialogLink = document.getElementById("dialogLink");

    const themeToggle = document.getElementById("themeToggle");

    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");


    function createProjectCard(project, index) {

        const article = document.createElement("article");

        article.className = "project-card";

        article.dataset.projectId = project.id;
        article.dataset.index = index;

        article.innerHTML = `

            <div class="project-card-inner">

                <div class="project-card-face project-card-front">

                    <div class="project-visual">

                        <div class="project-number">
                            ${String(index + 1).padStart(2, "0")}
                        </div>

                        <div class="project-icon">
                            <i data-lucide="${project.icon}"></i>
                        </div>

                        <div class="project-orbit orbit-one"></div>
                        <div class="project-orbit orbit-two"></div>

                        <span class="project-mini-label">
                            ${project.category}
                        </span>

                    </div>


                    <div class="project-info">

                        <div>

                            <p>
                                ${project.category}
                            </p>

                            <h3>
                                ${project.title}
                            </h3>

                        </div>

                        <span class="project-arrow">
                            <i data-lucide="arrow-up-right"></i>
                        </span>

                    </div>

                </div>


                <div class="project-card-face project-card-back">

                    <div class="back-content">

                        <p class="back-label">
                            ${project.category}
                        </p>

                        <h3>
                            ${project.title}
                        </h3>

                        <p>
                            ${project.description}
                        </p>

                        <button
                            class="project-open"
                            type="button"
                            data-project-open="${project.id}"
                        >
                            Abrir proyecto
                            <i data-lucide="arrow-up-right"></i>
                        </button>

                    </div>

                </div>

            </div>
        `;

        return article;
    }


    function renderProjects() {

        if (!stage) return;

        stage.innerHTML = "";

        if (!currentProjects.length) {

            stage.innerHTML = `
                <div class="empty-projects">
                    <i data-lucide="folder-open"></i>
                    <h3>No hay proyectos</h3>
                    <p>
                        No hay proyectos dentro de esta categoría.
                    </p>
                </div>
            `;

            if (window.lucide) {
                lucide.createIcons();
            }

            updatePosition();

            return;
        }

        currentIndex = Math.min(
            currentIndex,
            currentProjects.length - 1
        );

        currentProjects.forEach((project, index) => {

            const card = createProjectCard(project, index);

            stage.appendChild(card);

        });

        updateCards();

        if (window.lucide) {
            lucide.createIcons();
        }

        addCardEvents();
    }


    function updateCards() {

        const cards = stage.querySelectorAll(".project-card");

        cards.forEach((card, index) => {

            card.classList.remove(
                "is-active",
                "is-left",
                "is-right",
                "is-hidden"
            );

            if (index === currentIndex) {

                card.classList.add("is-active");

            } else if (index === getPreviousIndex()) {

                card.classList.add("is-left");

            } else if (index === getNextIndex()) {

                card.classList.add("is-right");

            } else {

                card.classList.add("is-hidden");

            }

        });

        updatePosition();
    }


    function getPreviousIndex() {

        if (!currentProjects.length) {
            return -1;
        }

        return (
            currentIndex - 1 + currentProjects.length
        ) % currentProjects.length;
    }


    function getNextIndex() {

        if (!currentProjects.length) {
            return -1;
        }

        return (
            currentIndex + 1
        ) % currentProjects.length;
    }


    function updatePosition() {

        if (!positionElement) return;

        if (!currentProjects.length) {

            positionElement.textContent = "00 / 00";

            return;
        }

        positionElement.textContent =
            `${String(currentIndex + 1).padStart(2, "0")} / ${String(currentProjects.length).padStart(2, "0")}`;
    }


    function goToProject(index) {

        if (!currentProjects.length) {
            return;
        }

        if (index < 0) {
            index = currentProjects.length - 1;
        }

        if (index >= currentProjects.length) {
            index = 0;
        }

        currentIndex = index;

        updateCards();
    }


    function addCardEvents() {

        const cards = stage.querySelectorAll(".project-card");

        cards.forEach((card, index) => {

            card.addEventListener("click", event => {

                const openButton =
                    event.target.closest("[data-project-open]");

                if (openButton) {
                    return;
                }

                if (index !== currentIndex) {

                    currentIndex = index;

                    updateCards();

                    return;
                }

                card.classList.toggle("is-flipped");

            });

        });


        const openButtons =
            stage.querySelectorAll("[data-project-open]");

        openButtons.forEach(button => {

            button.addEventListener("click", event => {

                event.stopPropagation();

                const projectId =
                    button.dataset.projectOpen;

                openProject(projectId);

            });

        });

    }


    function openProject(projectId) {

        const project = projects.find(
            item => item.id === projectId
        );

        if (!project) {
            return;
        }

        dialogCategory.textContent =
            project.category;

        dialogTitle.textContent =
            project.title;

        dialogDescription.textContent =
            project.description;

        dialogLink.href =
            project.link || "#";

        dialogLink.hidden =
            !project.link;

        dialogLink.target =
            "_blank";

        dialogLink.rel =
            "noopener noreferrer";


        const iconContainer =
            document.querySelector(".dialog-icon");

        if (iconContainer) {

            iconContainer.innerHTML = `
                <i data-lucide="${project.icon}"></i>
            `;

        }


        if (window.lucide) {
            lucide.createIcons();
        }


        if (typeof dialog.showModal === "function") {

            dialog.showModal();

        } else {

            dialog.setAttribute("open", "");

        }

    }


    function closeDialog() {

        if (!dialog) {
            return;
        }

        if (typeof dialog.close === "function") {

            dialog.close();

        } else {

            dialog.removeAttribute("open");

        }

    }


    filters.forEach(filterButton => {

        filterButton.addEventListener("click", () => {

            filters.forEach(button => {
                button.classList.remove("active");
            });

            filterButton.classList.add("active");

            const filter =
                filterButton.dataset.filter;

            if (filter === "all") {

                currentProjects = [...projects];

            } else {

                currentProjects =
                    projects.filter(
                        project =>
                            project.filter === filter
                    );

            }

            currentIndex = 0;

            renderProjects();

        });

    });


    if (previousButton) {

        previousButton.addEventListener(
            "click",
            () => {
                goToProject(currentIndex - 1);
            }
        );

    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            () => {
                goToProject(currentIndex + 1);
            }
        );

    }


    if (dialogClose) {

        dialogClose.addEventListener(
            "click",
            closeDialog
        );

    }


    if (dialog) {

        dialog.addEventListener(
            "click",
            event => {

                if (event.target === dialog) {
                    closeDialog();
                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape" && dialog.open) {
                closeDialog();
            }

            if (
                event.key === "ArrowLeft" &&
                !dialog.open
            ) {
                goToProject(currentIndex - 1);
            }

            if (
                event.key === "ArrowRight" &&
                !dialog.open
            ) {
                goToProject(currentIndex + 1);
            }

        }
    );


    function setupTheme() {

        if (!themeToggle) {
            return;
        }

        const savedTheme =
            localStorage.getItem("portfolio-theme");

        if (savedTheme === "light") {

            document.body.classList.add("light");
            document.documentElement.classList.add("light");

        }

        updateThemeIcon();


        themeToggle.addEventListener(
            "click",
            () => {

                const isLight =
                    document.body.classList.toggle("light");

                document.documentElement.classList.toggle(
                    "light",
                    isLight
                );

                localStorage.setItem(
                    "portfolio-theme",
                    isLight ? "light" : "dark"
                );

                updateThemeIcon();

            }
        );

    }


    function updateThemeIcon() {

        if (!themeToggle) {
            return;
        }

        const isLight =
            document.body.classList.contains("light");

        themeToggle.innerHTML = `
            <i data-lucide="${isLight ? "moon" : "sun"}"></i>
        `;

        themeToggle.setAttribute(
            "aria-label",
            isLight
                ? "Cambiar a modo oscuro"
                : "Cambiar a modo claro"
        );

        themeToggle.setAttribute(
            "title",
            isLight
                ? "Modo oscuro"
                : "Modo claro"
        );

        if (window.lucide) {
            lucide.createIcons();
        }

    }


    function setupMobileMenu() {

        if (!menuToggle || !mainNav) {
            return;
        }

        menuToggle.addEventListener(
            "click",
            () => {

                mainNav.classList.toggle("open");

                const isOpen =
                    mainNav.classList.contains("open");

                menuToggle.innerHTML = `
                    <i data-lucide="${isOpen ? "x" : "menu"}"></i>
                `;

                if (window.lucide) {
                    lucide.createIcons();
                }

            }
        );


        mainNav.querySelectorAll("a").forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    mainNav.classList.remove("open");

                    menuToggle.innerHTML = `
                        <i data-lucide="menu"></i>
                    `;

                    if (window.lucide) {
                        lucide.createIcons();
                    }

                }
            );

        });

    }


    function setupNavigationObserver() {

        const sections =
            document.querySelectorAll("main section[id]");

        const navLinks =
            document.querySelectorAll(".nav-links a");

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        navLinks.forEach(link => {
                            link.classList.remove("active");
                        });

                        const activeLink =
                            document.querySelector(
                                `.nav-links a[href="#${entry.target.id}"]`
                            );

                        if (activeLink) {
                            activeLink.classList.add("active");
                        }

                    });

                },
                {
                    rootMargin: "-35% 0px -55% 0px"
                }
            );

        sections.forEach(section => {
            observer.observe(section);
        });

    }


    function setupRevealAnimations() {

        const elements =
            document.querySelectorAll(".reveal");

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: .12
                }
            );

        elements.forEach(element => {
            observer.observe(element);
        });

    }


    function setupCursorGlow() {

        const glow =
            document.querySelector(".cursor-glow");

        if (!glow) {
            return;
        }

        if (
            window.matchMedia(
                "(pointer: coarse)"
            ).matches
        ) {
            glow.style.display = "none";
            return;
        }

        window.addEventListener(
            "pointermove",
            event => {

                glow.style.left =
                    `${event.clientX}px`;

                glow.style.top =
                    `${event.clientY}px`;

            }
        );

    }


    setupTheme();
    setupMobileMenu();
    setupNavigationObserver();
    setupRevealAnimations();
    setupCursorGlow();

    renderProjects();

    if (window.lucide) {
        lucide.createIcons();
    }

});