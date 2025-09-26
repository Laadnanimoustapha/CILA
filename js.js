// --- Global Resume Data Object ---
        let resumeData = {
            meta: {
                title: "My Awesome Resume",
                theme: "light",
                template: "classic",
                mood: "focus"
            },
            personal: {
                fullName: "",
                professionalTitle: "",
                email: "",
                phone: "",
                location: "",
                summary: ""
            },
            projects: [],
            links: [],
            experience: [],
            education: [],
            languages: [],
            certifications: [],
            skills: []
        };

        // --- DOM Elements ---
        const DOMElements = {
            html: document.documentElement,
            resumeTitleInput: document.getElementById('resumeTitleInput'),
            themeToggle: document.getElementById('themeToggle'),
            templateSelectBtn: document.getElementById('templateSelectBtn'),
            currentTemplateName: document.getElementById('currentTemplateName'),
            templateDropdown: document.getElementById('templateDropdown'),
            moodSelectBtn: document.getElementById('moodSelectBtn'), // Added mood select button
            moodDropdown: document.getElementById('moodDropdown'),
            resumePaper: document.getElementById('resumePaper'),
            resumePreviewContent: document.getElementById('resume-preview-content'),
            saveStatus: document.getElementById('saveStatus'),
            resetResumeBtn: document.getElementById('resetResumeBtn'),
            previewToggle: document.getElementById('previewToggle'),
            mainExportBtn: document.getElementById('mainExportBtn'),
            exportPdfBtn: document.getElementById('exportPdfBtn'),
            exportMarkdownBtn: document.getElementById('exportMarkdownBtn'),
            confirmationModal: document.getElementById('confirmationModal'),
            modalMessage: document.getElementById('modalMessage'),
            confirmYesBtn: document.getElementById('confirmYesBtn'),
            confirmNoBtn: document.getElementById('confirmNoBtn'),

            // Personal Info Inputs
            fullNameInput: document.getElementById('fullName'),
            professionalTitleInput: document.getElementById('professionalTitle'),
            emailInput: document.getElementById('email'),
            phoneInput: document.getElementById('phone'),
            locationInput: document.getElementById('location'),
            summaryInput: document.getElementById('summary'),

            // Preview Elements
            previewFullName: document.getElementById('previewFullName'),
            previewProfessionalTitle: document.getElementById('previewProfessionalTitle'),
            previewEmail: document.getElementById('previewEmail'),
            previewPhone: document.getElementById('previewPhone'),
            previewLocation: document.getElementById('previewLocation'),
            previewSummary: document.getElementById('previewSummary'),
            previewLinksContainer: document.getElementById('previewLinksContainer'),
            previewExperienceContainer: document.getElementById('previewExperienceContainer'),
            previewProjectsContainer: document.getElementById('previewProjectsContainer'),
            previewEducationContainer: document.getElementById('previewEducationContainer'),
            previewLanguagesContainer: document.getElementById('previewLanguagesContainer'),
            previewCertificationsContainer: document.getElementById('previewCertificationsContainer'),
            previewSkillsContainer: document.getElementById('previewSkillsContainer'),

            // Add Buttons
            addProjectBtn: document.getElementById('addProjectBtn'),
            addLinkBtn: document.getElementById('addLinkBtn'),
            addExperienceBtn: document.getElementById('addExperienceBtn'),
            addEducationBtn: document.getElementById('addEducationBtn'),
            addLanguageBtn: document.getElementById('addLanguageBtn'),
            addCertificationBtn: document.getElementById('addCertificationBtn'),
            addSkillBtn: document.getElementById('addSkillBtn'),

            // Dynamic Containers
            projectsContainer: document.getElementById('projectsContainer'),
            linksContainer: document.getElementById('linksContainer'),
            experienceContainer: document.getElementById('experienceContainer'),
            educationContainer: document.getElementById('educationContainer'),
            languagesContainer: document.getElementById('languagesContainer'),
            certificationsContainer: document.getElementById('certificationsContainer'),
            skillsContainer: document.getElementById('skillsContainer'),
            addSkillInputContainer: document.getElementById('addSkillInputContainer'),
            newSkillInput: document.getElementById('newSkillInput'),
            confirmAddSkillBtn: document.getElementById('confirmAddSkillBtn')
        };

        // --- Utility Functions ---

        /**
         * Displays a confirmation modal.
         * @param {string} message - The message to display in the modal.
         * @returns {Promise<boolean>} A promise that resolves to true if confirmed, false otherwise.
         */
        function showConfirmationModal(message) {
            return new Promise((resolve) => {
                DOMElements.modalMessage.textContent = message;
                DOMElements.confirmationModal.style.display = 'flex'; // Show modal

                const onConfirm = () => {
                    DOMElements.confirmationModal.style.display = 'none';
                    DOMElements.confirmYesBtn.removeEventListener('click', onConfirm);
                    DOMElements.confirmNoBtn.removeEventListener('click', onCancel);
                    resolve(true);
                };

                const onCancel = () => {
                    DOMElements.confirmationModal.style.display = 'none';
                    DOMElements.confirmYesBtn.removeEventListener('click', onConfirm);
                    DOMElements.confirmNoBtn.removeEventListener('click', onCancel);
                    resolve(false);
                };

                DOMElements.confirmYesBtn.addEventListener('click', onConfirm);
                DOMElements.confirmNoBtn.addEventListener('click', onCancel);
            });
        }

        /**
         * Updates a specific property in the resumeData object.
         * @param {string} path - Dot-separated path to the property (e.g., 'personal.fullName').
         * @param {*} value - The new value for the property.
         */
        function updateResumeData(path, value) {
            console.log(`Updating resumeData path: ${path} with value: ${value}`); // Debug log
            const parts = path.split('.');
            let current = resumeData;
            for (let i = 0; i < parts.length - 1; i++) {
                if (!current[parts[i]]) {
                    current[parts[i]] = {};
                }
                current = current[parts[i]];
            }
            current[parts[parts.length - 1]] = value;
            saveResumeData(); // Auto-save on every update
        }

        /**
         * Saves the current resumeData to localStorage and shows a "Saved!" indicator.
         */
        function saveResumeData() {
            localStorage.setItem('resumeData', JSON.stringify(resumeData));
            console.log('Resume data saved to localStorage:', resumeData); // Debug log
            DOMElements.saveStatus.classList.remove('opacity-0');
            DOMElements.saveStatus.classList.add('opacity-100');
            setTimeout(() => {
                DOMElements.saveStatus.classList.remove('opacity-100');
                DOMElements.saveStatus.classList.add('opacity-0');
            }, 2000);
        }

        /**
         * Loads resumeData from localStorage on page load.
         */
        function loadResumeData() {
            const savedData = localStorage.getItem('resumeData');
            if (savedData) {
                resumeData = JSON.parse(savedData);
                console.log('Resume data loaded from localStorage:', resumeData); // Debug log
            } else {
                console.log('No saved resume data found, initializing with default.'); // Debug log
            }
            // Apply theme, template, mood from loaded data
            applyTheme(resumeData.meta.theme);
            applyTemplate(resumeData.meta.template);
            applyMood(resumeData.meta.mood);
            renderForm();
            renderPreview();
        }

        // --- Render Functions ---

        /**
         * Populates form fields from the resumeData object.
         */
        function renderForm() {
            console.log('Rendering form...'); // Debug log
            // Personal Info
            DOMElements.resumeTitleInput.value = resumeData.meta.title || "My Awesome Resume";
            DOMElements.fullNameInput.value = resumeData.personal.fullName || "";
            DOMElements.professionalTitleInput.value = resumeData.personal.professionalTitle || "";
            DOMElements.emailInput.value = resumeData.personal.email || "";
            DOMElements.phoneInput.value = resumeData.personal.phone || "";
            DOMElements.locationInput.value = resumeData.personal.location || "";
            DOMElements.summaryInput.value = resumeData.personal.summary || "";

            // Trigger floating label update for loaded values
            document.querySelectorAll('.floating-input').forEach(input => {
                if (input.value) {
                    if (input.nextElementSibling) { // Check if nextElementSibling exists
                        input.nextElementSibling.classList.add('text-primary-light', 'dark:text-primary-dark', 'bg-bg-light', 'dark:bg-bg-dark', '-translate-y-0', 'scale-90');
                    }
                } else {
                    if (input.nextElementSibling) { // Check if nextElementSibling exists
                        input.nextElementSibling.classList.remove('text-primary-light', 'dark:text-primary-dark', 'bg-bg-light', 'dark:bg-bg-dark', '-translate-y-0', 'scale-90');
                    }
                }
            });

            // Render dynamic sections
            renderDynamicSection(DOMElements.projectsContainer, resumeData.projects, createProjectFormItem, 'projects');
            renderDynamicSection(DOMElements.linksContainer, resumeData.links, createLinkFormItem, 'links');
            renderDynamicSection(DOMElements.experienceContainer, resumeData.experience, createExperienceFormItem, 'experience');
            renderDynamicSection(DOMElements.educationContainer, resumeData.education, createEducationFormItem, 'education');
            renderDynamicSection(DOMElements.languagesContainer, resumeData.languages, createLanguageFormItem, 'languages');
            renderDynamicSection(DOMElements.certificationsContainer, resumeData.certifications, createCertificationFormItem, 'certifications');
            renderDynamicSection(DOMElements.skillsContainer, resumeData.skills, createSkillFormItem, 'skills');
        }

        /**
         * Renders the resume preview based on the resumeData object.
         */
        function renderPreview() {
            console.log('Rendering preview...'); // Debug log
            // Update meta info
            DOMElements.currentTemplateName.textContent = resumeData.meta.template.charAt(0).toUpperCase() + resumeData.meta.template.slice(1);
            // Ensure classes are correctly applied and previous ones removed
            DOMElements.resumePaper.className = 'resume-paper p-8'; // Reset class list
            DOMElements.resumePaper.classList.add(`template-${resumeData.meta.template}`, `mood-${resumeData.meta.mood}`);


            // Personal Info
            DOMElements.previewFullName.textContent = resumeData.personal.fullName || "[Your Name]";
            DOMElements.previewProfessionalTitle.textContent = resumeData.personal.professionalTitle || "[Professional Title]";
            DOMElements.previewEmail.textContent = resumeData.personal.email || "[Email]";
            DOMElements.previewPhone.textContent = resumeData.personal.phone || "[Phone]";
            DOMElements.previewLocation.textContent = resumeData.personal.location || "[Location]";
            DOMElements.previewSummary.textContent = resumeData.personal.summary || "[Professional Summary]";

            // Render dynamic preview sections
            renderDynamicPreviewSection(DOMElements.previewLinksContainer, resumeData.links, createLinkPreviewItem);
            renderDynamicPreviewSection(DOMElements.previewExperienceContainer, resumeData.experience, createExperiencePreviewItem);
            renderDynamicPreviewSection(DOMElements.previewProjectsContainer, resumeData.projects, createProjectPreviewItem);
            renderDynamicPreviewSection(DOMElements.previewEducationContainer, resumeData.education, createEducationPreviewItem);
            renderDynamicPreviewSection(DOMElements.previewLanguagesContainer, resumeData.languages, createLanguagePreviewItem);
            renderDynamicPreviewSection(DOMElements.previewCertificationsContainer, resumeData.certifications, createCertificationPreviewItem);
            renderDynamicPreviewSection(DOMElements.previewSkillsContainer, resumeData.skills, createSkillPreviewItem);
        }

        /**
         * Generic function to render dynamic form sections.
         * @param {HTMLElement} container - The DOM element to append items to.
         * @param {Array} dataArray - The array from resumeData (e.g., resumeData.projects).
         * @param {Function} createItemHtmlFn - Function that returns HTML string for a single item.
         * @param {string} sectionName - The name of the section (e.g., 'projects').
         */
        function renderDynamicSection(container, dataArray, createItemHtmlFn, sectionName) {
            console.log(`Rendering dynamic form section: ${sectionName}`); // Debug log
            container.innerHTML = ''; // Clear existing content
            dataArray.forEach((item, index) => {
                const itemHtml = createItemHtmlFn(item, index, sectionName);
                const div = document.createElement('div');
                div.innerHTML = itemHtml;
                container.appendChild(div.firstElementChild); // Append the actual element
            });
            attachDynamicEventListeners(sectionName); // Re-attach listeners after rendering
        }

        /**
         * Generic function to render dynamic preview sections.
         * @param {HTMLElement} container - The DOM element to append items to.
         * @param {Array} dataArray - The array from resumeData (e.g., resumeData.projects).
         * @param {Function} createItemHtmlFn - Function that returns HTML string for a single item.
         */
        function renderDynamicPreviewSection(container, dataArray, createItemHtmlFn) {
            console.log(`Rendering dynamic preview section for ${container.id}`); // Debug log
            container.innerHTML = ''; // Clear existing content
            dataArray.forEach((item, index) => {
                const itemHtml = createItemHtmlFn(item, index);
                const div = document.createElement('div');
                div.innerHTML = itemHtml;
                container.appendChild(div.firstElementChild); // Append the actual element
            });
        }

        // --- Dynamic Item HTML Templates (Form) ---

        function createProjectFormItem(project, index, sectionName) {
            const isEditing = project.isEditing || false;
            return `
                <div class="bg-card-light dark:bg-card-dark p-4 rounded-lg border border-gray-200 dark:border-gray-700 animate-fade-in" data-index="${index}" data-section="${sectionName}">
                    <div class="flex justify-between items-start mb-2">
                        ${isEditing ? `
                            <div class="flex-1 space-y-2">
                                <div class="relative">
                                    <input type="text" data-field="title" id="${sectionName}-title-${index}" placeholder=" " value="${project.title || ''}" class="floating-input w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:border-primary-light dark:focus:border-primary-dark focus:outline-none text-sm">
                                    <label for="${sectionName}-title-${index}" class="floating-label">Project Title</label>
                                </div>
                                <div class="relative">
                                    <input type="text" data-field="subtitle" id="${sectionName}-subtitle-${index}" placeholder=" " value="${project.subtitle || ''}" class="floating-input w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:border-primary-light dark:focus:border-primary-dark focus:outline-none text-sm">
                                    <label for="${sectionName}-subtitle-${index}" class="floating-label">Subtitle (e.g., Open Source)</label>
                                </div>
                                <div class="relative">
                                    <input type="url" data-field="link" id="${sectionName}-link-${index}" placeholder=" " value="${project.link || ''}" class="floating-input w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:border-primary-light dark:focus:border-primary-dark focus:outline-none text-sm">
                                    <label for="${sectionName}-link-${index}" class="floating-label">Project URL</label>
                                </div>
                                <div class="relative">
                                    <textarea data-field="description" id="${sectionName}-description-${index}" placeholder=" " rows="2" class="floating-input w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:border-primary-light dark:focus:border-primary-dark focus:outline-none text-sm">${project.description || ''}</textarea>
                                    <label for="${sectionName}-description-${index}" class="floating-label">Project Description</label>
                                </div>
                                <div class="relative">
                                    <input type="text" data-field="tags" id="${sectionName}-tags-${index}" placeholder=" " value="${(project.tags || []).join(', ') || ''}" class="floating-input w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:border-primary-light dark:focus:border-primary-dark focus:outline-none text-sm">
                                    <label for="${sectionName}-tags-${index}" class="floating-label">Tags (comma-separated)</label>
                                </div>
                            </div>
                        ` : `
                            <div>
                                <h3 class="font-semibold">${project.title || 'New Project'}</h3>
                                <p class="text-sm text-gray-600 dark:text-gray-400">${project.subtitle || ''}</p>
                            </div>
                        `}
                        <div class="flex space-x-2">
                            <button class="text-gray-500 hover:text-primary-light dark:hover:text-primary-dark edit-btn" data-index="${index}" data-section="${sectionName}">
                                <i class="fas fa-pencil-alt"></i>
                            </button>
                            <button class="text-gray-500 hover:text-red-500 delete-btn" data-index="${index}" data-section="${sectionName}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                    ${!isEditing && project.link ? `
                        <div class="flex items-center text-sm mb-2">
                            <i class="fas fa-link mr-1 text-gray-500"></i>
                            <span class="text-primary-light dark:text-primary-dark">${project.link}</span>
                        </div>
                    ` : ''}
                    ${!isEditing && project.description ? `<p class="text-sm mb-2">${project.description}</p>` : ''}
                    ${!isEditing && project.tags && project.tags.length > 0 ? `
                        <div class="flex flex-wrap gap-2">
                            ${project.tags.map(tag => `<span class="bg-highlight-light dark:bg-highlight-dark px-2 py-0.5 rounded-full text-xs">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }

        function createLinkFormItem(link, index, sectionName) {
            const isEditing = link.isEditing || false;
            const iconClass = link.type === 'github' ? 'fab fa-github' :
                              link.type === 'linkedin' ? 'fab fa-linkedin text-blue-600' :
                              'fas fa-link';
            return `
                <div class="flex items-center justify-between bg-card-light dark:bg-card-dark p-3 rounded-lg border border-gray-200 dark:border-gray-700 animate-fade-in" data-index="${index}" data-section="${sectionName}">
                    ${isEditing ? `
                        <div class="flex-1 grid grid-cols-2 gap-2">
                            <div class="relative">
                                <input type="text" data-field="type" id="${sectionName}-type-${index}" placeholder=" " value="${link.type || ''}" class="floating-input w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:border-primary-light dark:focus:border-primary-dark focus:outline-none text-sm">
                                <label for="${sectionName}-type-${index}" class="floating-label">Type (github, linkedin, website)</label>
                            </div>
                            <div class="relative">
                                <input type="url" data-field="url" id="${sectionName}-url-${index}" placeholder=" " value="${link.url || ''}" class="floating-input w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:border-primary-light dark:focus:border-primary-dark focus:outline-none text-sm">
                                <label for="${sectionName}-url-${index}" class="floating-label">URL</label>
                            </div>
                        </div>
                    ` : `
                        <div class="flex items-center">
                            <i class="${iconClass} text-lg mr-3 w-6 text-center"></i>
                            <span>${link.url || 'New Link'}</span>
                        </div>
                    `}
                    <div class="flex space-x-2 ml-4">
                        <button class="text-gray-500 hover:text-primary-light dark:hover:text-primary-dark edit-btn" data-index="${index}" data-section="${sectionName}">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                        <button class="text-gray-500 hover:text-red-500 delete-btn" data-index="${index}" data-section="${sectionName}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
        }

        function createExperienceFormItem(exp, index, sectionName) {
            const isEditing = exp.isEditing || false;
            return `
                <div class="bg-card-light dark:bg-card-dark p-4 rounded-lg border border-gray-200 dark:border-gray-700 animate-fade-in" data-index="${index}" data-section="${sectionName}">
                    <div class="flex justify-between items-start mb-2">
                        ${isEditing ? `
                            <div class="flex-1 space-y-2">
                                <div class="relative">
                                    <input type="text" data-field="title" id="${sectionName}-title-${index}" placeholder=" " value="${exp.title || ''}" class="floating-input w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:border-primary-light dark:focus:border-primary-dark focus:outline-none text-sm">
                                    <label for="${sectionName}-title-${index}" class="floating-label">Job Title</label>
                                </div>
                                <div class="relative">
                                    <input type="text" data-field="company" id="${sectionName}-company-${index}" placeholder=" " value="${exp.company || ''}" class="floating-input w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:border-primary-light dark:focus:border-primary-dark focus:outline-none text-sm">
                                    <label for="${sectionName}-company-${index}" class="floating-label">Company</label>
                                </div>
                                <div class="relative">
                                    <input type="text" data-field="location" id="${sectionName}-location-${index}" placeholder=" " value="${exp.location || ''}" class="floating-input w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:border-primary-light dark:focus:border-primary-dark focus:outline-none text-sm">
                                    <label for="${sectionName}-location-${index}" class="floating-label">Location</label>
                                </div>
                                <div class="relative">
                                    <input type="text" data-field="duration" id="${sectionName}-duration-${index}" placeholder=" " value="${exp.duration || ''}" class="floating-input w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:border-primary-light dark:focus:border-primary-dark focus:outline-none text-sm">
                                    <label for="${sectionName}-duration-${index}" class="floating-label">e.g., Jan 2020 - Present</label>
                                </div>
                                <div class="relative">
                                    <textarea data-field="description" id="${sectionName}-description-${index}" placeholder=" " rows="3" class="floating-input w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:border-primary-light dark:focus:border-primary-dark focus:outline-none text-sm">${exp.description || ''}</textarea>
                                    <label for="${sectionName}-description-${index}" class="floating-label">Responsibilities (bullet points)</label>
                                </div>
                            </div>
                        ` : `
                            <div>
                                <h3 class="font-semibold">${exp.title || 'New Position'}</h3>
                                <p class="text-sm text-gray-600 dark:text-gray-400">${exp.company || ''}</p>
                            </div>
                        `}
                        <div class="flex space-x-2">
                            <button class="text-gray-500 hover:text-primary-light dark:hover:text-primary-dark edit-btn" data-index="${index}" data-section="${sectionName}">
                                <i class="fas fa-pencil-alt"></i>
                            </button>
                            <button class="text-gray-500 hover:text-red-500 delete-btn" data-index="${index}" data-section="${sectionName}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                    ${!isEditing && exp.duration && exp.location ? `
                        <div class="grid grid-cols-2 gap-2 mb-2">
                            <div class="flex items-center text-sm">
                                <i class="far fa-calendar-alt mr-1 text-gray-500"></i>
                                <span>${exp.duration}</span>
                            </div>
                            <div class="flex items-center text-sm">
                                <i class="fas fa-map-marker-alt mr-1 text-gray-500"></i>
                                <span>${exp.location}</span>
                            </div>
                        </div>
                    ` : ''}
                    ${!isEditing && exp.description ? `<p class="text-sm">${exp.description}</p>` : ''}
                </div>
            `;
        }

        function createEducationFormItem(edu, index, sectionName) {
            const isEditing = edu.isEditing || false;
            return `
                <div class="bg-card-light dark:bg-card-dark p-4 rounded-lg border border-gray-200 dark:border-gray-700 animate-fade-in" data-index="${index}" data-section="${sectionName}">
                    <div class="flex justify-between items-start mb-2">
                        ${isEditing ? `
                            <div class="flex-1 space-y-2">
                                <div class="relative">
                                    <input type="text" data-field="degree" id="${sectionName}-degree-${index}" placeholder=" " value="${edu.degree || ''}" class="floating-input w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:border-primary-light dark:focus:border-primary-dark focus:outline-none text-sm">
                                    <label for="${sectionName}-degree-${index}" class="floating-label">Degree/Field of Study</label>
                                </div>
                                <div class="relative">
                                    <input type="text" data-field="institution" id="${sectionName}-institution-${index}" placeholder=" " value="${edu.institution || ''}" class="floating-input w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:border-primary-light dark:focus:border-primary-dark focus:outline-none text-sm">
                                    <label for="${sectionName}-institution-${index}" class="floating-label">Institution</label>
                                </div>
                                <div class="relative">
                                    <input type="text" data-field="year" id="${sectionName}-year-${index}" placeholder=" " value="${edu.year || ''}" class="floating-input w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:border-primary-light dark:focus:border-primary-dark focus:outline-none text-sm">
                                    <label for="${sectionName}-year-${index}" class="floating-label">Years (e.g., 2015 - 2017)</label>
                                </div>
                                <div class="relative">
                                    <textarea data-field="description" id="${sectionName}-description-${index}" placeholder=" " rows="2" class="floating-input w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:border-primary-light dark:focus:border-primary-dark focus:outline-none text-sm">${edu.description || ''}</textarea>
                                    <label for="${sectionName}-description-${index}" class="floating-label">Description/Achievements</label>
                                </div>
                            </div>
                        ` : `
                            <div>
                                <h3 class="font-semibold">${edu.degree || 'New Degree'}</h3>
                                <p class="text-sm text-gray-600 dark:text-gray-400">${edu.institution || ''}</p>
                            </div>
                        `}
                        <div class="flex space-x-2">
                            <button class="text-gray-500 hover:text-primary-light dark:hover:text-primary-dark edit-btn" data-index="${index}" data-section="${sectionName}">
                                <i class="fas fa-pencil-alt"></i>
                            </button>
                            <button class="text-gray-500 hover:text-red-500 delete-btn" data-index="${index}" data-section="${sectionName}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                    ${!isEditing && edu.year ? `
                        <div class="flex items-center text-sm mb-2">
                            <i class="far fa-calendar-alt mr-1 text-gray-500"></i>
                            <span>${edu.year}</span>
                        </div>
                    ` : ''}
                    ${!isEditing && edu.description ? `<p class="text-sm">${edu.description}</p>` : ''}
                </div>
            `;
        }

        function createLanguageFormItem(lang, index, sectionName) {
            const isEditing = lang.isEditing || false;
            return `
                <div class="flex items-center justify-between bg-card-light dark:bg-card-dark p-3 rounded-lg border border-gray-200 dark:border-gray-700 animate-fade-in" data-index="${index}" data-section="${sectionName}">
                    ${isEditing ? `
                        <div class="flex-1 grid grid-cols-2 gap-2">
                            <div class="relative">
                                <input type="text" data-field="name" id="${sectionName}-name-${index}" placeholder=" " value="${lang.name || ''}" class="floating-input w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:border-primary-light dark:focus:border-primary-dark focus:outline-none text-sm">
                                <label for="${sectionName}-name-${index}" class="floating-label">Language Name</label>
                            </div>
                            <div class="relative">
                                <select data-field="proficiency" id="${sectionName}-proficiency-${index}" class="floating-input w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:border-primary-light dark:focus:border-primary-dark focus:outline-none text-sm">
                                    <option value="">Select Proficiency</option>
                                    <option value="Basic" ${lang.proficiency === 'Basic' ? 'selected' : ''}>Basic</option>
                                    <option value="Intermediate" ${lang.proficiency === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
                                    <option value="Fluent" ${lang.proficiency === 'Fluent' ? 'selected' : ''}>Fluent</option>
                                    <option value="Native" ${lang.proficiency === 'Native' ? 'selected' : ''}>Native</option>
                                </select>
                                <label for="${sectionName}-proficiency-${index}" class="floating-label">Proficiency</label>
                            </div>
                        </div>
                    ` : `
                        <div class="flex items-center space-x-4 w-full">
                            <span class="font-medium">${lang.name || 'New Language'}</span>
                            <div class="flex-1">
                                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div class="bg-primary-light dark:bg-primary-dark h-2 rounded-full" style="width: ${getProficiencyWidth(lang.proficiency)}%"></div>
                                </div>
                            </div>
                            <span class="text-sm text-gray-500">${lang.proficiency || ''}</span>
                        </div>
                    `}
                    <div class="flex space-x-2 ml-4">
                        <button class="text-gray-500 hover:text-primary-light dark:hover:text-primary-dark edit-btn" data-index="${index}" data-section="${sectionName}">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                        <button class="text-gray-500 hover:text-red-500 delete-btn" data-index="${index}" data-section="${sectionName}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
        }

        function getProficiencyWidth(proficiency) {
            switch (proficiency) {
                case 'Basic': return 25;
                case 'Intermediate': return 60;
                case 'Fluent': return 90;
                case 'Native': return 100;
                default: return 0;
            }
        }

        function createCertificationFormItem(cert, index, sectionName) {
            const isEditing = cert.isEditing || false;
            return `
                <div class="bg-card-light dark:bg-card-dark p-4 rounded-lg border border-gray-200 dark:border-gray-700 animate-fade-in" data-index="${index}" data-section="${sectionName}">
                    <div class="flex justify-between items-start mb-2">
                        ${isEditing ? `
                            <div class="flex-1 space-y-2">
                                <div class="relative">
                                    <input type="text" data-field="name" id="${sectionName}-name-${index}" placeholder=" " value="${cert.name || ''}" class="floating-input w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:border-primary-light dark:focus:border-primary-dark focus:outline-none text-sm">
                                    <label for="${sectionName}-name-${index}" class="floating-label">Certification Name</label>
                                </div>
                                <div class="relative">
                                    <input type="text" data-field="issuer" id="${sectionName}-issuer-${index}" placeholder=" " value="${cert.issuer || ''}" class="floating-input w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:border-primary-light dark:focus:border-primary-dark focus:outline-none text-sm">
                                    <label for="${sectionName}-issuer-${index}" class="floating-label">Issuing Organization</label>
                                </div>
                                <div class="relative">
                                    <input type="text" data-field="dates" id="${sectionName}-dates-${index}" placeholder=" " value="${cert.dates || ''}" class="floating-input w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:border-primary-light dark:focus:border-primary-dark focus:outline-none text-sm">
                                    <label for="${sectionName}-dates-${index}" class="floating-label">Issued: Month Year - Expires: Month Year</label>
                                </div>
                                <div class="relative">
                                    <input type="text" data-field="credentialId" id="${sectionName}-credentialId-${index}" placeholder=" " value="${cert.credentialId || ''}" class="floating-input w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:border-primary-light dark:focus:border-primary-dark focus:outline-none text-sm">
                                    <label for="${sectionName}-credentialId-${index}" class="floating-label">Credential ID</label>
                                </div>
                            </div>
                        ` : `
                            <div>
                                <h3 class="font-semibold">${cert.name || 'New Certification'}</h3>
                                <p class="text-sm text-gray-600 dark:text-gray-400">${cert.issuer || ''}</p>
                            </div>
                        `}
                        <div class="flex space-x-2">
                            <button class="text-gray-500 hover:text-primary-light dark:hover:text-primary-dark edit-btn" data-index="${index}" data-section="${sectionName}">
                                <i class="fas fa-pencil-alt"></i>
                            </button>
                            <button class="text-gray-500 hover:text-red-500 delete-btn" data-index="${index}" data-section="${sectionName}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                    ${!isEditing && cert.dates ? `
                        <div class="flex items-center text-sm mb-2">
                            <i class="far fa-calendar-alt mr-1 text-gray-500"></i>
                            <span>${cert.dates}</span>
                        </div>
                    ` : ''}
                    ${!isEditing && cert.credentialId ? `<p class="text-sm">Credential ID: ${cert.credentialId}</p>` : ''}
                </div>
            `;
        }

        function createSkillFormItem(skill, index, sectionName) {
            return `
                <div class="flex items-center bg-highlight-light dark:bg-highlight-dark px-3 py-1 rounded-full animate-fade-in" data-index="${index}" data-section="${sectionName}">
                    <span>${skill}</span>
                    <button class="ml-1 text-gray-500 hover:text-red-500 delete-btn" data-index="${index}" data-section="${sectionName}">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                </div>
            `;
        }

        // --- Dynamic Item HTML Templates (Preview) ---

        function createLinkPreviewItem(link) {
            const iconClass = link.type === 'github' ? 'fab fa-github' :
                              link.type === 'linkedin' ? 'fab fa-linkedin' :
                              'fas fa-link';
            return `
                <div class="flex items-center">
                    <i class="${iconClass} mr-2 text-primary-light dark:text-primary-dark"></i>
                    <span><a href="${link.url}" target="_blank" class="text-primary-light dark:text-primary-dark hover:underline">${link.url || '[Link]'}</a></span>
                </div>
            `;
        }

        function createExperiencePreviewItem(exp) {
            const descriptionHtml = (exp.description || '').split('\n').map(line => `<li>${line.trim()}</li>`).join('');
            return `
                <div class="mb-6">
                    <div class="flex justify-between items-start mb-1">
                        <h4 class="font-bold">${exp.title || '[Job Title]'}</h4>
                        <div class="text-sm text-gray-600 dark:text-gray-400">${exp.duration || '[Dates]'}</div>
                    </div>
                    <div class="flex justify-between items-start mb-2">
                        <div class="text-sm text-gray-600 dark:text-gray-400">${exp.company || '[Company]'}, ${exp.location || '[Location]'}</div>
                    </div>
                    <ul class="list-disc pl-5 text-gray-800 dark:text-gray-200 space-y-1">
                        ${descriptionHtml || '<li>[Responsibilities/Achievements]</li>'}
                    </ul>
                </div>
            `;
        }

        function createProjectPreviewItem(project) {
            const descriptionHtml = (project.description || '').split('\n').map(line => `<li>${line.trim()}</li>`).join('');
            return `
                <div class="mb-6">
                    <div class="flex justify-between items-start mb-1">
                        <h4 class="font-bold">${project.title || '[Project Title]'}</h4>
                        <div class="text-sm text-gray-600 dark:text-gray-400">${project.subtitle || ''}</div>
                    </div>
                    ${project.link ? `
                        <div class="flex items-center text-sm mb-2">
                            <i class="fas fa-link mr-1 text-gray-500"></i>
                            <span class="text-primary-light dark:text-primary-dark"><a href="${project.link}" target="_blank" class="hover:underline">${project.link}</a></span>
                        </div>
                    ` : ''}
                    <ul class="list-disc pl-5 text-gray-800 dark:text-gray-200 space-y-1">
                        ${descriptionHtml || '<li>[Project Description]</li>'}
                    </ul>
                    ${project.tags && project.tags.length > 0 ? `
                        <div class="flex flex-wrap gap-2 mt-2">
                            ${project.tags.map(tag => `<span class="bg-highlight-light dark:bg-highlight-dark px-2 py-0.5 rounded-full text-xs">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }

        function createEducationPreviewItem(edu) {
            return `
                <div class="mb-6">
                    <div class="flex justify-between items-start mb-1">
                        <h4 class="font-bold">${edu.degree || '[Degree]'}</h4>
                        <div class="text-sm text-gray-600 dark:text-gray-400">${edu.year || '[Years]'}</div>
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">${edu.institution || '[Institution]'}</div>
                    <p class="text-gray-800 dark:text-gray-200">
                        ${edu.description || '[Description/Achievements]'}
                    </p>
                </div>
            `;
        }

        function createLanguagePreviewItem(lang) {
            return `
                <div>
                    <div class="flex justify-between mb-1">
                        <span class="font-medium">${lang.name || '[Language]'}</span>
                        <span class="text-sm text-gray-600 dark:text-gray-400">${lang.proficiency || ''}</span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div class="bg-primary-light dark:bg-primary-dark h-2 rounded-full" style="width: ${getProficiencyWidth(lang.proficiency)}%"></div>
                    </div>
                </div>
            `;
        }

        function createCertificationPreviewItem(cert) {
            return `
                <div class="mb-6">
                    <h4 class="font-bold">${cert.name || '[Certification Name]'}</h4>
                    <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">${cert.issuer || '[Issuer]'}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">${cert.dates || '[Dates]'}</div>
                    <div class="text-sm">${cert.credentialId ? `Credential ID: ${cert.credentialId}` : ''}</div>
                </div>
            `;
        }

        function createSkillPreviewItem(skill) {
            return `<span class="bg-highlight-light dark:bg-highlight-dark px-3 py-1 rounded-full text-sm">${skill}</span>`;
        }


        // --- Event Handlers ---

        /**
         * Attaches event listeners for dynamic elements (edit/delete buttons, input changes).
         * Uses event delegation for efficiency.
         * @param {string} sectionName - The name of the section to attach listeners for.
         */
        function attachDynamicEventListeners(sectionName) {
            console.log(`Attaching dynamic event listeners for: ${sectionName}`); // Debug log
            const container = DOMElements[`${sectionName}Container`];
            if (!container) {
                console.warn(`Container for ${sectionName} not found.`); // Debug log
                return;
            }

            // Clear existing listeners to prevent duplicates (important for re-renders)
            // This is implicitly handled by re-creating elements with innerHTML = ''
            // but explicitly removing listeners from old elements if they were not fully replaced
            // would be more robust for complex scenarios. For now, re-creation is sufficient.

            container.querySelectorAll('.edit-btn').forEach(button => {
                button.onclick = (event) => {
                    console.log(`Edit button clicked for ${sectionName} at index ${event.currentTarget.dataset.index}`); // Debug log
                    const index = parseInt(event.currentTarget.dataset.index);
                    toggleEditMode(sectionName, index);
                };
            });

            container.querySelectorAll('.delete-btn').forEach(button => {
                button.onclick = async (event) => {
                    console.log(`Delete button clicked for ${sectionName} at index ${event.currentTarget.dataset.index}`); // Debug log
                    const index = parseInt(event.currentTarget.dataset.index);
                    const confirmed = await showConfirmationModal(`Are you sure you want to delete this ${sectionName.slice(0, -1)}?`);
                    if (confirmed) {
                        deleteDynamicItem(sectionName, index, event.currentTarget.closest('.animate-fade-in'));
                    }
                };
            });

            container.querySelectorAll('input[data-field], textarea[data-field], select[data-field]').forEach(input => {
                // Remove any existing input listeners to prevent duplicates on re-render
                input.removeEventListener('input', handleDynamicInputChange);
                input.addEventListener('input', handleDynamicInputChange);

                // Re-apply floating label logic for newly added inputs
                // This part is crucial for inputs rendered after initial load
                if (input.value) {
                    if (input.nextElementSibling) {
                        input.nextElementSibling.classList.add('text-primary-light', 'dark:text-primary-dark', 'bg-bg-light', 'dark:bg-bg-dark', '-translate-y-0', 'scale-90');
                    }
                }
                // Ensure focus/blur listeners are also correctly re-attached or handled
                input.removeEventListener('focus', handleFloatingLabelFocus);
                input.addEventListener('focus', handleFloatingLabelFocus);
                input.removeEventListener('blur', handleFloatingLabelBlur);
                input.addEventListener('blur', handleFloatingLabelBlur);
            });
        }

        /**
         * Handles input changes for dynamic form fields.
         * This function is separated to allow easy removal/re-attachment of listeners.
         */
        function handleDynamicInputChange(event) {
            const parentElement = event.currentTarget.closest('[data-index]');
            if (!parentElement) {
                console.error("Could not find parent element with data-index for dynamic input change.");
                return;
            }
            const index = parseInt(parentElement.dataset.index);
            const sectionName = parentElement.dataset.section;
            const field = event.currentTarget.dataset.field;
            let value = event.currentTarget.value;

            console.log(`Dynamic input changed: Section=${sectionName}, Index=${index}, Field=${field}, Value=${value}`); // Debug log

            if (field === 'tags') {
                value = value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
            }

            if (resumeData[sectionName] && resumeData[sectionName][index]) {
                resumeData[sectionName][index][field] = value;
                saveResumeData();
                renderPreview(); // Only re-render preview for efficiency
            } else {
                console.error(`Invalid data path or index for update: ${sectionName}[${index}][${field}]`);
            }
        }

        /**
         * Handles focus event for floating labels.
         */
        function handleFloatingLabelFocus(event) {
            const input = event.target;
            if (input.nextElementSibling) {
                input.nextElementSibling.classList.add('text-primary-light', 'dark:text-primary-dark', 'bg-bg-light', 'dark:bg-bg-dark', '-translate-y-0', 'scale-90');
            }
        }

        /**
         * Handles blur event for floating labels.
         */
        function handleFloatingLabelBlur(event) {
            const input = event.target;
            if (!input.value) {
                if (input.nextElementSibling) {
                    input.nextElementSibling.classList.remove('text-primary-light', 'dark:text-primary-dark', 'bg-bg-light', 'dark:bg-bg-dark', '-translate-y-0', 'scale-90');
                }
            }
        }


        /**
         * Toggles the edit mode for a dynamic item.
         * @param {string} sectionName - The name of the section.
         * @param {number} index - The index of the item in the array.
         */
        function toggleEditMode(sectionName, index) {
            console.log(`Toggling edit mode for ${sectionName} at index ${index}`); // Debug log
            if (resumeData[sectionName] && resumeData[sectionName][index]) {
                resumeData[sectionName][index].isEditing = !resumeData[sectionName][index].isEditing;
                saveResumeData();
                renderForm(); // Re-render the form to show/hide inputs
            } else {
                console.error(`Attempted to toggle edit mode for non-existent item: ${sectionName}[${index}]`);
            }
        }

        /**
         * Adds a new empty item to a dynamic section.
         * @param {string} sectionName - The name of the section (e.g., 'projects').
         * @param {object} newItemTemplate - The template object for a new item.
         */
        function addDynamicItem(sectionName, newItemTemplate) {
            console.log(`Adding new item to ${sectionName}`); // Debug log
            resumeData[sectionName].push({ ...newItemTemplate, isEditing: true }); // New items start in edit mode
            saveResumeData();
            renderForm();
            renderPreview(); // Update preview with new empty item (or placeholder)
        }

        /**
         * Deletes a dynamic item from a section with a fade-out animation.
         * @param {string} sectionName - The name of the section.
         * @param {number} index - The index of the item to delete.
         * @param {HTMLElement} elementToRemove - The actual DOM element to animate and remove.
         */
        function deleteDynamicItem(sectionName, index, elementToRemove) {
            console.log(`Deleting item from ${sectionName} at index ${index}`); // Debug log
            if (elementToRemove) {
                elementToRemove.classList.add('animate-fade-out');
                elementToRemove.addEventListener('animationend', () => {
                    resumeData[sectionName].splice(index, 1);
                    saveResumeData();
                    renderForm(); // Re-render the form to update indices and remove element
                    renderPreview(); // Update the preview
                }, { once: true });
            } else {
                // Fallback if element not found (shouldn't happen with proper event delegation)
                resumeData[sectionName].splice(index, 1);
                saveResumeData();
                renderForm();
                renderPreview();
                console.warn(`Element to remove not found for ${sectionName}[${index}], deleting data directly.`);
            }
        }

        // --- Theme / Mood / Template Functions ---

        /**
         * Applies the selected theme (light/dark).
         * @param {string} theme - 'light' or 'dark'.
         */
        function applyTheme(theme) {
            console.log(`Applying theme: ${theme}`); // Debug log
            if (theme === 'dark') {
                DOMElements.html.classList.add('dark');
            } else {
                DOMElements.html.classList.remove('dark');
            }
            resumeData.meta.theme = theme;
            saveResumeData();
        }

        /**
         * Applies the selected template to the resume paper.
         * @param {string} templateName - 'classic', 'developer', 'minimal', 'creative', 'modern', 'professional'.
         */
        function applyTemplate(templateName) {
            console.log(`Applying template: ${templateName}`); // Debug log
            DOMElements.resumePaper.classList.remove('template-classic', 'template-developer', 'template-minimal', 'template-creative', 'template-modern', 'template-professional');
            DOMElements.resumePaper.classList.add(`template-${templateName}`);
            resumeData.meta.template = templateName;
            DOMElements.currentTemplateName.textContent = templateName.charAt(0).toUpperCase() + templateName.slice(1);
            saveResumeData();
        }

        /**
         * Applies the selected mood to the resume paper.
         * @param {string} moodName - 'hacker', 'focus', 'chill', 'street', 'bold', 'energetic'.
         */
        function applyMood(moodName) {
            console.log(`Applying mood: ${moodName}`); // Debug log
            DOMElements.resumePaper.classList.remove('mood-hacker', 'mood-focus', 'mood-chill', 'mood-street', 'mood-bold', 'mood-energetic');
            DOMElements.resumePaper.classList.add(`mood-${moodName}`);
            resumeData.meta.mood = moodName;
            saveResumeData();
        }

        // --- Export Functions ---

        /**
         * Exports the resume in the specified format.
         * @param {string} format - 'pdf' or 'markdown'.
         */
        async function exportResume(format) {
            console.log(`Exporting resume as: ${format}`); // Debug log
            const fileName = `${resumeData.meta.title.replace(/\s/g, '-') || 'resume'}`;

            if (DOMElements.previewToggle.checked) {
                console.log('Preview before export is checked. Entering preview mode.'); // Debug log
                // Temporarily hide non-print elements for full-screen preview
                document.querySelectorAll('.no-print').forEach(el => el.style.display = 'none');
                DOMElements.resumePaper.style.width = 'unset'; // Allow it to take full width
                DOMElements.resumePaper.style.minHeight = 'unset'; // Allow it to take full height
                DOMElements.resumePaper.style.boxShadow = 'none';
                DOMElements.resumePaper.classList.add('!p-0'); // Remove padding for full page
                document.body.style.margin = '0';
                document.body.style.padding = '0';
                document.body.style.overflow = 'auto'; // Allow scrolling

                // Wait for styles to apply before showing print dialog or generating PDF
                await new Promise(resolve => setTimeout(resolve, 50));

                const confirmed = await showConfirmationModal("Preview mode active. Press 'Yes' to proceed with export, 'No' to return to editing.");

                // Restore hidden elements and styles
                document.querySelectorAll('.no-print').forEach(el => el.style.display = '');
                DOMElements.resumePaper.style.width = '';
                DOMElements.resumePaper.style.minHeight = '';
                DOMElements.resumePaper.style.boxShadow = '';
                DOMElements.resumePaper.classList.remove('!p-0');
                document.body.style.margin = '';
                document.body.style.padding = '';
                document.body.style.overflow = ''; // Restore default overflow

                if (!confirmed) {
                    console.log('Export cancelled by user during preview.'); // Debug log
                    return; // User cancelled export
                }
            }

            switch (format) {
                case 'pdf':
                    // html2pdf options for better PDF generation
                    const options = {
                        margin: [10, 10, 10, 10], // top, left, bottom, right
                        filename: `${fileName}.pdf`,
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
                        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                    };
                    html2pdf().set(options).from(DOMElements.resumePaper).save();
                    console.log('PDF export initiated.'); // Debug log
                    break;
                case 'markdown':
                    const markdownContent = generateMarkdown();
                    downloadFile(markdownContent, `${fileName}.md`, 'text/markdown');
                    console.log('Markdown export initiated.'); // Debug log
                    break;
            }
        }

        /**
         * Generates Markdown content from resumeData.
         * @returns {string} Markdown string.
         */
        function generateMarkdown() {
            let md = `# ${resumeData.personal.fullName || 'Your Name'}\n\n`;
            md += `## ${resumeData.personal.professionalTitle || 'Professional Title'}\n\n`;

            md += `**Email**: ${resumeData.personal.email || 'N/A'}\n`;
            md += `**Phone**: ${resumeData.personal.phone || 'N/A'}\n`;
            md += `**Location**: ${resumeData.personal.location || 'N/A'}\n`;
            resumeData.links.forEach(link => {
                md += `**${link.type.charAt(0).toUpperCase() + link.type.slice(1)}**: ${link.url}\n`;
            });
            md += '\n';

            if (resumeData.personal.summary) {
                md += `## Summary\n\n${resumeData.personal.summary}\n\n`;
            }

            if (resumeData.experience.length > 0) {
                md += `## Experience\n\n`;
                resumeData.experience.forEach(exp => {
                    md += `### ${exp.title || 'Job Title'} at ${exp.company || 'Company'}\n`;
                    md += `${exp.duration || 'Dates'}, ${exp.location || 'Location'}\n`;
                    if (exp.description) {
                        exp.description.split('\n').forEach(line => {
                            if (line.trim()) md += `- ${line.trim()}\n`;
                        });
                    }
                    md += '\n';
                });
            }

            if (resumeData.projects.length > 0) {
                md += `## Projects\n\n`;
                resumeData.projects.forEach(project => {
                    md += `### ${project.title || 'Project Title'}\n`;
                    if (project.subtitle) md += `*${project.subtitle}*\n`;
                    if (project.link) md += `[Link](${project.link})\n`;
                    if (project.description) {
                        project.description.split('\n').forEach(line => {
                            if (line.trim()) md += `- ${line.trim()}\n`;
                        });
                    }
                    if (project.tags && project.tags.length > 0) {
                        md += `*Tags*: ${project.tags.join(', ')}\n`;
                    }
                    md += '\n';
                });
            }

            if (resumeData.education.length > 0) {
                md += `## Education\n\n`;
                resumeData.education.forEach(edu => {
                    md += `### ${edu.degree || 'Degree'} from ${edu.institution || 'Institution'}\n`;
                    md += `${edu.year || 'Years'}\n`;
                    if (edu.description) md += `${edu.description}\n`;
                    md += '\n';
                });
            }

            if (resumeData.languages.length > 0) {
                md += `## Languages\n\n`;
                resumeData.languages.forEach(lang => {
                    md += `- ${lang.name || 'Language'}: ${lang.proficiency || 'N/A'}\n`;
                });
                md += '\n';
            }

            if (resumeData.certifications.length > 0) {
                md += `## Certifications\n\n`;
                resumeData.certifications.forEach(cert => {
                    md += `### ${cert.name || 'Certification Name'}\n`;
                    md += `${cert.issuer || 'Issuer'}\n`;
                    md += `${cert.dates || 'Dates'}\n`;
                    if (cert.credentialId) md += `Credential ID: ${cert.credentialId}\n`;
                    md += '\n';
                });
            }

            if (resumeData.skills.length > 0) {
                md += `## Skills\n\n`;
                md += resumeData.skills.map(skill => `- ${skill}`).join('\n');
                md += '\n';
            }

            return md;
        }

        /**
         * Downloads a file with the given content and filename.
         * @param {string} content - The file content.
         * @param {string} filename - The name of the file.
         * @param {string} mimeType - The MIME type of the file.
         */
        function downloadFile(content, filename, mimeType) {
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        /**
         * Resets all resume data and clears localStorage.
         */
        async function resetResume() {
            console.log('Reset resume button clicked.'); // Debug log
            const confirmed = await showConfirmationModal("Are you sure you want to reset your resume? All data will be lost.");
            if (confirmed) {
                localStorage.removeItem('resumeData');
                resumeData = { // Reset to initial empty state
                    meta: {
                        title: "My Awesome Resume",
                        theme: "light",
                        template: "classic",
                        mood: "focus"
                    },
                    personal: {
                        fullName: "",
                        professionalTitle: "",
                        email: "",
                        phone: "",
                        location: "",
                        summary: ""
                    },
                    projects: [],
                    links: [],
                    experience: [],
                    education: [],
                    languages: [],
                    certifications: [],
                    skills: []
                };
                renderForm();
                renderPreview();
                applyTheme('light'); // Reset theme to light
                applyTemplate('classic'); // Reset template
                applyMood('focus'); // Reset mood
                DOMElements.saveStatus.textContent = 'Resume Reset!';
                DOMElements.saveStatus.classList.remove('opacity-0');
                DOMElements.saveStatus.classList.add('opacity-100');
                setTimeout(() => {
                    DOMElements.saveStatus.classList.remove('opacity-100');
                    DOMElements.saveStatus.classList.add('opacity-0');
                }, 2000);
                console.log('Resume reset and localStorage cleared.'); // Debug log
            } else {
                console.log('Resume reset cancelled.'); // Debug log
            }
        }

        // --- Dropdown Control Variables ---
        let templateDropdownTimeout;
        let moodDropdownTimeout;

        /**
         * Shows a dropdown menu.
         * @param {HTMLElement} dropdownElement - The dropdown menu element.
         */
        function showDropdown(dropdownElement) {
            dropdownElement.classList.remove('hidden');
            clearTimeout(templateDropdownTimeout); // Clear any pending hide for template
            clearTimeout(moodDropdownTimeout);     // Clear any pending hide for mood
        }

        /**
         * Hides a dropdown menu after a delay.
         * @param {HTMLElement} dropdownElement - The dropdown menu element.
         * @param {string} timeoutVarName - The name of the timeout variable ('templateDropdownTimeout' or 'moodDropdownTimeout').
         */
        function hideDropdownAfterDelay(dropdownElement, timeoutVarName) {
            // Use a global variable to store the timeout ID for each dropdown
            if (timeoutVarName === 'templateDropdownTimeout') {
                templateDropdownTimeout = setTimeout(() => {
                    dropdownElement.classList.add('hidden');
                }, 1000); // 1 second delay
            } else if (timeoutVarName === 'moodDropdownTimeout') {
                moodDropdownTimeout = setTimeout(() => {
                    dropdownElement.classList.add('hidden');
                }, 1000); // 1 second delay
            }
        }

        /**
         * Clears the hide timeout for a dropdown.
         * @param {string} timeoutVarName - The name of the timeout variable.
         */
        function clearTimeoutForDropdown(timeoutVarName) {
            if (timeoutVarName === 'templateDropdownTimeout' && templateDropdownTimeout) {
                clearTimeout(templateDropdownTimeout);
                templateDropdownTimeout = null;
            } else if (timeoutVarName === 'moodDropdownTimeout' && moodDropdownTimeout) {
                clearTimeout(moodDropdownTimeout);
                moodDropdownTimeout = null;
            }
        }

        // --- Initialization ---
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM Content Loaded. Initializing app...'); // Debug log
            loadResumeData(); // Load data on page load

            // --- Event Listeners for Static Elements ---

            // Resume Title Input
            DOMElements.resumeTitleInput.addEventListener('input', (event) => {
                updateResumeData('meta.title', event.target.value);
            });

            // Theme Toggle
            DOMElements.themeToggle.addEventListener('click', () => {
                const newTheme = DOMElements.html.classList.contains('dark') ? 'light' : 'dark';
                applyTheme(newTheme);
            });

            // Template Selection Button Click
            DOMElements.templateSelectBtn.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent document click from immediately closing
                showDropdown(DOMElements.templateDropdown);
                DOMElements.moodDropdown.classList.add('hidden'); // Hide other dropdown
            });

            // Template Dropdown Item Click
            DOMElements.templateDropdown.addEventListener('click', (event) => {
                const template = event.target.closest('[data-template]');
                if (template) {
                    applyTemplate(template.dataset.template);
                    DOMElements.templateDropdown.classList.add('hidden'); // Hide after selection
                }
            });

            // Mood Selection Button Click
            DOMElements.moodSelectBtn.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent document click from immediately closing
                showDropdown(DOMElements.moodDropdown);
                DOMElements.templateDropdown.classList.add('hidden'); // Hide other dropdown
            });

            // Mood Dropdown Item Click
            DOMElements.moodDropdown.addEventListener('click', (event) => {
                const mood = event.target.closest('[data-mood]');
                if (mood) {
                    applyMood(mood.dataset.mood);
                    DOMElements.moodDropdown.classList.add('hidden'); // Hide after selection
                }
            });

            // Auto-hide dropdowns on mouse leave with delay
            DOMElements.templateDropdown.addEventListener('mouseleave', () => hideDropdownAfterDelay(DOMElements.templateDropdown, 'templateDropdownTimeout'));
            DOMElements.templateDropdown.addEventListener('mouseenter', () => clearTimeoutForDropdown('templateDropdownTimeout'));

            DOMElements.moodDropdown.addEventListener('mouseleave', () => hideDropdownAfterDelay(DOMElements.moodDropdown, 'moodDropdownTimeout'));
            DOMElements.moodDropdown.addEventListener('mouseenter', () => clearTimeoutForDropdown('moodDropdownTimeout'));

            // Close dropdowns when clicking anywhere else on the document
            document.addEventListener('click', (event) => {
                if (!DOMElements.templateSelectBtn.contains(event.target) && !DOMElements.templateDropdown.contains(event.target)) {
                    DOMElements.templateDropdown.classList.add('hidden');
                }
                if (!DOMElements.moodSelectBtn.contains(event.target) && !DOMElements.moodDropdown.contains(event.target)) {
                    DOMElements.moodDropdown.classList.add('hidden');
                }
            });


            // Personal Info Input Sync
            // Attaching these listeners directly as they are static elements
            DOMElements.fullNameInput.addEventListener('input', (event) => {
                updateResumeData('personal.fullName', event.target.value);
                DOMElements.previewFullName.textContent = event.target.value || "[Your Name]";
            });
            DOMElements.professionalTitleInput.addEventListener('input', (event) => {
                updateResumeData('personal.professionalTitle', event.target.value);
                DOMElements.previewProfessionalTitle.textContent = event.target.value || "[Professional Title]";
            });
            DOMElements.emailInput.addEventListener('input', (event) => {
                updateResumeData('personal.email', event.target.value);
                DOMElements.previewEmail.textContent = event.target.value || "[Email]";
            });
            DOMElements.phoneInput.addEventListener('input', (event) => {
                updateResumeData('personal.phone', event.target.value);
                DOMElements.previewPhone.textContent = event.target.value || "[Phone]";
            });
            DOMElements.locationInput.addEventListener('input', (event) => {
                updateResumeData('personal.location', event.target.value);
                DOMElements.previewLocation.textContent = event.target.value || "[Location]";
            });
            DOMElements.summaryInput.addEventListener('input', (event) => {
                updateResumeData('personal.summary', event.target.value);
                DOMElements.previewSummary.textContent = event.target.value || "[Professional Summary]";
            });

            // Add Buttons for Dynamic Sections
            DOMElements.addProjectBtn.addEventListener('click', () => addDynamicItem('projects', { title: '', subtitle: '', link: '', description: '', tags: [] }));
            DOMElements.addLinkBtn.addEventListener('click', () => addDynamicItem('links', { type: 'website', url: '' }));
            DOMElements.addExperienceBtn.addEventListener('click', () => addDynamicItem('experience', { title: '', company: '', location: '', duration: '', description: '' }));
            DOMElements.addEducationBtn.addEventListener('click', () => addDynamicItem('education', { degree: '', institution: '', year: '', description: '' }));
            DOMElements.addLanguageBtn.addEventListener('click', () => addDynamicItem('languages', { name: '', proficiency: '' }));
            DOMElements.addCertificationBtn.addEventListener('click', () => addDynamicItem('certifications', { name: '', issuer: '', dates: '', credentialId: '' }));
            
            // Skill Add Button and Input
            DOMElements.addSkillBtn.addEventListener('click', () => {
                DOMElements.addSkillInputContainer.classList.remove('hidden');
                DOMElements.newSkillInput.focus();
            });
            DOMElements.confirmAddSkillBtn.addEventListener('click', () => {
                const skill = DOMElements.newSkillInput.value.trim();
                if (skill) {
                    resumeData.skills.push(skill);
                    saveResumeData();
                    renderForm(); // Re-render skills section
                    renderPreview(); // Update preview
                    DOMElements.newSkillInput.value = '';
                    DOMElements.addSkillInputContainer.classList.add('hidden');
                }
            });
            DOMElements.newSkillInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault(); // Prevent form submission if input is inside a form
                    DOMElements.confirmAddSkillBtn.click();
                }
            });

            // Export Buttons
            DOMElements.exportPdfBtn.addEventListener('click', () => exportResume('pdf'));
            DOMElements.exportMarkdownBtn.addEventListener('click', () => exportResume('markdown'));
            DOMElements.mainExportBtn.addEventListener('click', () => exportResume('pdf')); // Default to PDF for main button

            // Reset Button
            DOMElements.resetResumeBtn.addEventListener('click', resetResume);

            // Keyboard Shortcut for Export (Ctrl + E)
            document.addEventListener('keydown', (event) => {
                if (event.ctrlKey && event.key === 'e') {
                    event.preventDefault(); // Prevent default browser behavior (e.g., opening downloads)
                    exportResume('pdf'); // Trigger default export
                }
            });
        });

        // --- Initial Theme Check (from original code, kept for consistency) ---
        // This runs once when the script loads, before DOMContentLoaded
        if (localStorage.getItem('theme') === 'dark' || 
            (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        }
        
        // Floating label functionality for *initial* static inputs
        // Dynamic inputs have this re-applied in attachDynamicEventListeners
        document.querySelectorAll('.floating-input').forEach(input => {
            if (input.value) {
                if (input.nextElementSibling) {
                    input.nextElementSibling.classList.add('text-primary-light', 'dark:text-primary-dark', 'bg-bg-light', 'dark:bg-bg-dark', '-translate-y-0', 'scale-90');
                }
            }
            // Ensure these are only attached once for static elements
            input.removeEventListener('focus', handleFloatingLabelFocus); // Remove if already attached
            input.addEventListener('focus', handleFloatingLabelFocus);
            input.removeEventListener('blur', handleFloatingLabelBlur); // Remove if already attached
            input.addEventListener('blur', handleFloatingLabelBlur);
        });
        
        // Add shake animation for invalid inputs (from original code)
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('invalid', () => {
                input.classList.add('animate-shake');
                setTimeout(() => {
                    input.classList.remove('animate-shake');
                }, 500);
            });
        });