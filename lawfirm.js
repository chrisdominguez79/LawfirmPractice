/* ============================================================================
   CASTLEROD LAW GROUP PLLC - SHARED SITE BEHAVIOUR
   ============================================================================

   One file, loaded by every page with:

       <script src="lawfirm.js" defer></script>

   The Spanish pages in /es/ load the very same file as "../lawfirm.js", so the
   browser downloads and caches it exactly once for the whole site instead of
   re-parsing a copy embedded in each page.

   "defer" means the browser keeps parsing the HTML while this downloads and
   only runs it once the page is built, so every element this file looks for
   already exists and nothing here blocks the page from painting.

   Everything below is written defensively: a page that has no accordion, or no
   hamburger menu, simply skips that section instead of throwing an error. That
   is what lets one shared file serve the homepage, the service pages, the FAQ
   page and the Our Team page.

   CONTENTS
       1. Cached element lookups
       2. Scroll position on load
       3. Mobile navigation menu
       4. Mobile "Criminal Defense" submenu
       5. Practice area / FAQ accordions
       6. Contact and phone button press feedback
   ========================================================================== */

(function () {
    "use strict";

    /* ------------------------------------------------------------------------
       1. CACHED ELEMENT LOOKUPS

       The original code called document.querySelector(".navbar") again inside
       every single function. Searching the document is not free, so each
       element is looked up once here and reused everywhere below.
       ---------------------------------------------------------------------- */

    var navbar = document.querySelector(".navbar");
    var hamburger = document.querySelector(".hamburger");
    var accordionLists = document.querySelectorAll(".accordion-list");
    var actionButtons = document.querySelectorAll("button.contactUs");

    /* Matches the 768px breakpoint used in lawfirm.css. Created once and then
       re-read, rather than re-parsing the media query string on every tap. */
    var mobileQuery = window.matchMedia("(max-width: 768px)");

    function isMobile() {
        return mobileQuery.matches;
    }


    /* ------------------------------------------------------------------------
       2. SCROLL POSITION ON LOAD

       Browsers restore your old scroll position when you navigate back to a
       page. On this site that looked like a bug: you would tap "Home" and land
       halfway down the page.

       Telling the browser scrollRestoration = "manual" is the supported way to
       switch that behaviour off. It replaces the old approach of firing a
       50ms setTimeout on every single page load to fight the browser after the
       fact, which caused a visible jump.
       ---------------------------------------------------------------------- */

    if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
    }

    function scrollToTop() {
        window.scrollTo(0, 0);

        /* Drop any "#section" left in the address bar so a refresh does not
           jump back down to that section. */
        if (window.location.hash) {
            window.history.replaceState(null, "", window.location.pathname + window.location.search);
        }
    }

    window.addEventListener("load", scrollToTop);

    /* "pageshow" also fires when the page is restored from the back/forward
       cache, which Safari uses heavily and which does not re-fire "load". */
    window.addEventListener("pageshow", function (event) {
        if (!event.persisted) {
            scrollToTop();
        }
    });


    /* ------------------------------------------------------------------------
       3. MOBILE NAVIGATION MENU

       Opens and closes the full screen hamburger menu, and keeps the button's
       icon, label and aria-expanded state in sync so screen readers announce
       the menu correctly.

       This is attached to window because the HTML calls it inline, for example:
           <button onclick="toggleMenu()">
           <a href="faq.html" onclick="toggleMenu(true)">
       ---------------------------------------------------------------------- */

    function setMenuState(shouldOpen) {
        if (!navbar || !hamburger) {
            return;
        }

        navbar.classList.toggle("active", shouldOpen);
        hamburger.classList.toggle("active", shouldOpen);

        /* Stops the page behind the menu from scrolling while it is open. */
        document.body.classList.toggle("no-scroll", shouldOpen);

        /* Collapse any open submenu whenever the whole menu closes. */
        if (!shouldOpen) {
            closeAllDropdowns();
        }

        hamburger.textContent = shouldOpen ? "✕" : "☰";   /* ✕ : ☰ */
        hamburger.setAttribute("aria-expanded", String(shouldOpen));
        hamburger.setAttribute(
            "aria-label",
            shouldOpen ? "Close navigation menu" : "Open navigation menu"
        );
    }

    /**
     * Toggle the mobile menu.
     *
     * @param {boolean} forceClose - pass true to always close, which is what
     *                               the navigation links do so that tapping a
     *                               link never leaves the menu open.
     */
    window.toggleMenu = function (forceClose) {
        if (!navbar) {
            return;
        }

        var isOpen = navbar.classList.contains("active");

        setMenuState(!forceClose && !isOpen);
    };

    /**
     * Close the mobile menu without toggling it. Used by the submenu links,
     * which should always dismiss the menu on the way to the new page.
     */
    window.closeMobileMenu = function () {
        if (!isMobile()) {
            return;
        }

        setMenuState(false);
    };


    /* ------------------------------------------------------------------------
       4. MOBILE "CRIMINAL DEFENSE" SUBMENU

       On desktop the submenu opens on hover, handled entirely in CSS, so this
       does nothing there. On mobile there is no hover, so the parent link
       becomes a toggle instead of a link.
       ---------------------------------------------------------------------- */

    function closeAllDropdowns() {
        document.querySelectorAll(".dropdown.open").forEach(function (dropdown) {
            dropdown.classList.remove("open");
        });
    }

    /**
     * Expand or collapse the submenu. Called inline from the HTML:
     *     <a class="dropbtn" onclick="toggleMobileDropdown(event)">
     *
     * @param {Event} event - the click on the "Criminal Defense" parent link.
     */
    window.toggleMobileDropdown = function (event) {
        if (!isMobile()) {
            return;   /* Desktop uses the CSS :hover rules instead. */
        }

        /* Stop the browser following the "#Criminal-Defense" href. */
        event.preventDefault();

        var dropdown = event.currentTarget.closest(".dropdown");

        if (dropdown) {
            dropdown.classList.toggle("open");
        }
    };


    /* ------------------------------------------------------------------------
       5. PRACTICE AREA / FAQ ACCORDIONS

       Only one panel stays open at a time.

       This uses one click listener on each accordion list rather than one per
       header button. The homepage has thirteen headers, so this is thirteen
       listeners replaced by two, and it keeps working if headers are ever
       added to the HTML without touching this file.
       ---------------------------------------------------------------------- */

    accordionLists.forEach(function (list) {
        list.addEventListener("click", function (event) {
            /* Find the header that was clicked, if the click was on one. The
               closest() call is needed because the click usually lands on the
               <span> inside the button, not the button itself. */
            var header = event.target.closest(".accordion-header");

            if (!header || !list.contains(header)) {
                return;
            }

            var item = header.closest(".accordion-item");

            if (!item) {
                return;
            }

            var wasOpen = item.classList.contains("open");

            /* Close every open panel first.

               Delete this loop if you would rather let several sections stay
               open at the same time. */
            list.querySelectorAll(".accordion-item.open").forEach(function (openItem) {
                openItem.classList.remove("open");

                var openHeader = openItem.querySelector(".accordion-header");

                if (openHeader) {
                    openHeader.setAttribute("aria-expanded", "false");
                }
            });

            /* Then reopen the clicked one, unless the click was what closed it. */
            if (!wasOpen) {
                item.classList.add("open");
                header.setAttribute("aria-expanded", "true");
            }
        });
    });


    /* ------------------------------------------------------------------------
       6. CONTACT AND PHONE BUTTON PRESS FEEDBACK

       On desktop the gold hover colour is pure CSS. Phones have no hover, so
       these buttons would otherwise give no sign they were tapped. This adds
       the gold "is-pressed" class on touch and clears it shortly afterwards.

       The clearing matters because iOS keeps the button visually stuck in its
       pressed state after you return from the phone dialler or a new tab.
       ---------------------------------------------------------------------- */

    function clearPressedButtons() {
        actionButtons.forEach(function (button) {
            button.classList.remove("is-pressed");
            button.blur();
        });
    }

    actionButtons.forEach(function (button) {
        button.addEventListener("pointerdown", function () {
            if (!isMobile()) {
                return;
            }

            clearPressedButtons();
            button.classList.add("is-pressed");
        });

        button.addEventListener("click", function () {
            if (!isMobile()) {
                return;
            }

            /* Hold the gold for a moment so the tap is visible, then reset. */
            window.setTimeout(function () {
                button.classList.remove("is-pressed");
                button.blur();
            }, 300);
        });

        button.addEventListener("pointercancel", clearPressedButtons);
    });

    /* Reset after coming back from another tab, the dialler, or the contact
       form that opens in a new window. */
    window.addEventListener("pageshow", clearPressedButtons);
    window.addEventListener("focus", clearPressedButtons);

    document.addEventListener("visibilitychange", function () {
        if (!document.hidden) {
            clearPressedButtons();
        }
    });
}());
