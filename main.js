/**
* Template Name: Gp
* Template URL: https://bootstrapmade.com/gp-free-multipurpose-html-bootstrap-template/
* Updated: Aug 15 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
document.addEventListener('DOMContentLoaded', function () {
  setTimeout(function () {
    var modalElement = document.getElementById('staticBackdrop');
    var myModal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);

    // Check if modal is already shown
    if (!modalElement.classList.contains('show')) {
      myModal.show();
    } else {
      console.log('Modal is already open, skipping show().');
    }
  }, 7000); // 5000ms = 5 seconds
});



async function handleSubmit(e, sheet) {
  e.preventDefault();
  const form = e.target; // The form element
  const name = form.name.value.trim(); // Assuming your input has name="name"
  const phone = form.phone.value.trim(); // Assuming your input has name="phone"

  // // Validate inputs
  if (!name || !phone  ) {
    showAlert("الرجاء إدخال الاسم ورقم الهاتف و البريد الالكتروني.", "warning");
    return;
  }
  // console.log(name, phone,sheet);
  
  // Show progress bar
  const progressContainer = document.getElementById("preloader");
  progressContainer.classList.remove("d-none");

  try {
    const response = await fetch('./submit-sheet.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        name: name,
        phone: phone,
        compound: sheet
      })
    });

    const result = await response.json();
    if (result.success) {
      name.value = "";
      phone.value = "";

        window.location.href = './thank_you.html';

    } else {
      throw new Error(result.error || "Submission failed");
        progressContainer.classList.add('hidden');

    }
  } catch (error) {
    console.error("Error:", error);
    progressContainer.classList.add('hidden');
    showAlert("حدث خطأ، برجاء المحاولة مرة أخرى.", "danger");
  } finally {
    progressContainer.classList.add("d-none");
    progressContainer.classList.add('hidden');
  }
}
function showAlert(message, type) {
  const alertContainer = document.getElementById("alertContainer");

  // Clear any existing alerts
  while (alertContainer.firstChild) {
    alertContainer.firstChild.remove();
  }

  if (!message || !type) return;

  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} alert-dismissible fade`;
  alertDiv.role = "alert";
  alertDiv.innerHTML = `
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    ${message}
  `;

  alertContainer.appendChild(alertDiv);

  // Trigger reflow to enable transition
  void alertDiv.offsetWidth;

  // Trigger fade-in
  alertDiv.classList.add("show");

  // Auto-close after 10 seconds
  const AUTO_CLOSE_DELAY = 10000;
  // This runs AFTER the fade-out animation completes
  if (type === "success") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  setTimeout(() => {
    const bsAlert = bootstrap.Alert.getOrCreateInstance(alertDiv);
    bsAlert.close(); // Starts fade-out
  }, AUTO_CLOSE_DELAY);

  // ✅ Listen for when Bootstrap finishes removing the alert

}


(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
const preloader = document.querySelector('#preloader');
if (preloader) {
  window.addEventListener('load', () => {
    preloader.classList.add('d-none');
  });
}
  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  // document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
  //   let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
  //   let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
  //   let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

  //   let initIsotope;
  //   imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
  //     initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
  //       itemSelector: '.isotope-item',
  //       layoutMode: layout,
  //       filter: filter,
  //       sortBy: sort
  //     });
  //   });

  //   isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
  //     filters.addEventListener('click', function() {
  //       isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
  //       this.classList.add('filter-active');
  //       initIsotope.arrange({
  //         filter: this.getAttribute('data-filter')
  //       });
  //       if (typeof aosInit === 'function') {
  //         aosInit();
  //       }
  //     }, false);
  //   });

  // });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();