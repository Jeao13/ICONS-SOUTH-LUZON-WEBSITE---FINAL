        let isActive = true;
        let isActive2 = true;

        let aboutDropdown = document.getElementById("aboutDropdown");
        let aboutDropdown2 = document.getElementById("aboutDropdown2");
        let dropdownNavbarLink = document.getElementById("dropdownNavbarLink");
        let dropdownNavbarLink2 = document.getElementById("dropdownNavbarLink2");
        

        window.addEventListener("click", function(event) {
            if (event.target != dropdownNavbarLink) {
                aboutDropdown.style.display = "none";
            }

            if (event.target != dropdownNavbarLink2) {
                aboutDropdown2.style.display = "none";
            }
        });

        function toggleDropdown() {
            isActive = !isActive;
            if (isActive == true) {
                aboutDropdown.style.display = "none";
            } else {
                aboutDropdown.style.display = "block";
            }
        }


        function toggleDropdown2() {
            isActive2 = !isActive2;
            if (isActive2 == true) {
                aboutDropdown2.style.display = "none";
            } else {
                aboutDropdown2.style.display = "block";
            }
        }


        let isMobileMenuActive = false;
        let mobileMenu = document.getElementById("mobileMenu");
        function toggleMobileMenu() {
            isMobileMenuActive = !isMobileMenuActive;
            if (isMobileMenuActive == true) {
                mobileMenu.style.display = "none";
            } else {
                mobileMenu.style.display = "block";
            }
        }
