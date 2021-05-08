<template>
  <div v-cloak>
    <div class="wrap" :style="{ width: width, height: height }">
      <div class="view-box" ref="viewBox">
        <img
          :src="gitLoadingIcon"
          class="loading"
          v-show="state == 'loading'"
        />
        <img :src="imageUrl" ref="eImg" :class="`${rotateClass} eImg`" />
        <div class="tool" v-show="state == 'show'">
          <a href="javascript:;" class="narrow" @click="zoom('narrow')">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAFhUlEQVR4Xu3d0W0TYBRD4WQSRgVGZZIgBihuLYGu4i/Pvurv4xz1Mc+HDwIIfEjgiQ0CCHxMgCC+HQj8hQBBfD0QIIjvAAIdAf9BOm6uRggQZGRoNTsCBOm4uRohQJCRodXsCBCk4+ZqhABBRoZWsyNAkI6bqxECBBkZWs2OAEE6bq5GCBBkZGg1OwIE6bi5GiFAkJGh1ewIEKTj5mqEAEFGhlazI0CQjpurEQIEGRlazY4AQTpurkYIEGRkaDU7AgTpuLkaIUCQkaHV7AgQpOPmaoQAQUaGVrMjQJCOm6sRAgQZGVrNjgBBOm6uRggQZGRoNTsCBOm4uRohQJCRodXsCBCk4+ZqhABBRoZWsyNAkI6bqxECBBkZWs2OAEE6bq5GCBBkZGg1OwIE6bi5GiFAkJGh1ewIEKTj5mqEAEFGhlazI0CQjpurEQIEGRlazY4AQTpurkYIEGRkaDU7AgTpuLkaIUCQkaHV7AgQpOPmaoQAQUaGVrMjQJCOm6sRAgQZGVrNjgBBOm6uRggQZGRoNTsCBOm4uRohQJCRodXsCBCk4+ZqhABBRoZWsyNAkI6bqxECBBkZWs2OAEE6bq5GCBBkZGg1OwIE6bi5GiFAkJGh1ewIEKTj5mqEAEFGhlazI0CQjpurEQIEGRlazY4AQTpurkYIEGRkaDU7AgTpuLkaIUCQkaHV7AgQpOPmaoQAQUaGVrMjQJCOm6sRAgQZGVrNjgBBOm6uRggQZGRoNTsCBOm4uRohQJCRodXsCBCk4+ZqhABBRoZWsyNAkI6bqxECXxbk9Xr9eDwe30b4qPleBH49n88/399Pf1pBvn/6LwgicIfAT4LcGcNL7hEgyL1NvOgQAYIcGsNT7hEgyL1NvOgQAYIcGsNT7hEgyL1NvOgQAYIcGsNT7hEgyL1NvOgQAYIcGsNT7hEgyL1NvOgQAYIcGsNT7hEgyL1NvOgQAYIcGsNT7hEgyL1NvOgQAYIcGsNT7hEgyL1NvOgQAYIcGsNT7hEgyL1NvOgQAYIcGsNT7hEgyL1NvOgQAYIcGsNT7hEgyL1NvOgQAYIcGsNT7hEgyL1NvOgQAYIcGsNT7hEgyL1NvOgQAYIcGsNT7hEgyL1NvOgQAYIcGsNT7hH4b4L4+YN743tRJvDvf/4gv0ECgfch8OXfB3mf6pogkAkQJDOSGCZAkOHxVc8ECJIZSQwTIMjw+KpnAgTJjCSGCRBkeHzVMwGCZEYSwwQIMjy+6pkAQTIjiWECBBkeX/VMgCCZkcQwAYIMj696JkCQzEhimABBhsdXPRMgSGYkMUyAIMPjq54JECQzkhgmQJDh8VXPBAiSGUkMEyDI8PiqZwIEyYwkhgkQZHh81TMBgmRGEsMECDI8vuqZAEEyI4lhAgQZHl/1TIAgmZHEMAGCDI+veiZAkMxIYpgAQYbHVz0TIEhmJDFMgCDD46ueCRAkM5IYJkCQ4fFVzwQIkhlJDBMgyPD4qmcCBMmMJIYJEGR4fNUzAYJkRhLDBAgyPL7qmQBBMiOJYQIEGR5f9UyAIJmRxDABggyPr3omQJDMSGKYAEGGx1c9EyBIZiQxTIAgw+OrngkQJDOSGCZAkOHxVc8ECJIZSQwTIMjw+KpnAgTJjCSGCRBkeHzVMwGCZEYSwwQIMjy+6pkAQTIjiWECBBkeX/VMgCCZkcQwAYIMj696JkCQzEhimABBhsdXPRMgSGYkMUyAIMPjq54JECQzkhgmQJDh8VXPBAiSGUkMEyDI8PiqZwIEyYwkhgkQZHh81TMBgmRGEsMECDI8vuqZAEEyI4lhAgQZHl/1TIAgmZHEMAGCDI+veiZAkMxIYpgAQYbHVz0TIEhmJDFMgCDD46ueCRAkM5IYJkCQ4fFVzwR+A0/LoMnXZPSEAAAAAElFTkSuQmCC"
            />
          </a>
          <a href="javascript:;" class="rotate" @click="rotateLeft">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjAzMDY5OENCQkI0MTFFN0I3MTdFNUNERjk4QTREOEMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjAzMDY5OERCQkI0MTFFN0I3MTdFNUNERjk4QTREOEMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MDMwNjk4QUJCQjQxMUU3QjcxN0U1Q0RGOThBNEQ4QyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2MDMwNjk4QkJCQjQxMUU3QjcxN0U1Q0RGOThBNEQ4QyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PiYn1AQAAA7gSURBVHja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"
            />
          </a>
          <a href="javascript:;" class="rotate" @click="rotateRight">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjRDMzMzOUJCQzUwMTFFN0I3MTdFNUNERjk4QTREOEMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjRDMzMzOUNCQzUwMTFFN0I3MTdFNUNERjk4QTREOEMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MDMwNjk4RUJCQjQxMUU3QjcxN0U1Q0RGOThBNEQ4QyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2NEMzMzM5QUJDNTAxMUU3QjcxN0U1Q0RGOThBNEQ4QyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoZxBo0AAA8KSURBVHja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"
            />
          </a>
          <a href="javascript:;" class="enlarge" @click="zoom('enlarge')">
            <img
              src="data:image/png;base64,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"
            />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    image: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "300px",
    },
  },
  data() {
    return {
      state: "loading",
      rotateClass: "",
      rotateAngle: 0,
      zoomHeight: 0,
      gitLoadingIcon:
        "data:image/gif;base64,R0lGODlhgACAAKIEAN3d3bu7u////5mZmf///wAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjZEQUY1MTZCQjcwMTFFNTk2MEZBMUI3OTA4NTc3QTEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjZEQUY1MTdCQjcwMTFFNTk2MEZBMUI3OTA4NTc3QTEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCNkRBRjUxNEJCNzAxMUU1OTYwRkExQjc5MDg1NzdBMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCNkRBRjUxNUJCNzAxMUU1OTYwRkExQjc5MDg1NzdBMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDP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",
    };
  },
  computed: {
    imageUrl() {
      return this.image;
    },
  },
  mounted() {
    var _this = this;

    setTimeout(function () {
      _this.init();
    }, 800);
  },
  methods: {
    init() {
      var _this = this,
        img = _this.$refs.eImg,
        div = _this.$refs.viewBox;
      img.src = _this.imageUrl;
      this.state = "loading";

      if (_this.imageUrl == "") {
        img.src =
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAAH0CAIAAAAhSpB6AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAyIDc5LjE2NDM1MiwgMjAyMC8wMS8zMC0xNTo1MDozOCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjgxNkY3MzEzQTFDQjExRUJCQTA3ODJDREMxNkRCODQxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjgxNkY3MzE0QTFDQjExRUJCQTA3ODJDREMxNkRCODQxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODE2RjczMTFBMUNCMTFFQkJBMDc4MkNEQzE2REI4NDEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ODE2RjczMTJBMUNCMTFFQkJBMDc4MkNEQzE2REI4NDEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6m4DgAAAAPG0lEQVR42uzdbVPa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";
      }

      img.onload = function () {
        //初始化图片大小
        var height = div.offsetHeight;
        var width = div.offsetWidth;
        // if (img.offsetHeight > height) {
        img.height = height;
        // }

        img.style.display = "block";
        img.style.top = (height - img.offsetHeight) / 2 + "px";
        img.style.left = (width - img.offsetWidth) / 2 + "px";

        _this.state = "show";
      };

      //拖动图片
      img.onmousedown = function (ev) {
        ev.preventDefault();
        var oEvent = ev;
        var disX = oEvent.clientX - img.offsetLeft;
        var disY = oEvent.clientY - img.offsetTop;
        document.onmousemove = function (ev) {
          ev.preventDefault();
          oEvent = ev;
          img.style.left = oEvent.clientX - disX + "px";
          img.style.top = oEvent.clientY - disY + "px";
        };
        document.onmouseup = function () {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      };

      _this.rotateAngle = 0;
      _this.rotateClass = "";

      _this.mouseZoom("viewBox");
    },
    rotateRight() {
      var _this = this;

      switch (_this.rotateAngle) {
        case -90:
          _this.rotateAngle = 0;
          _this.rotateClass = "";
          break;
        case -180:
          _this.rotateAngle = -90;
          _this.rotateClass = "rotate-90";
          break;
        case -270:
          _this.rotateAngle = -180;
          _this.rotateClass = "rotate-180";
          break;
        case 0:
          _this.rotateAngle = 90;
          _this.rotateClass = "rotate90";
          break;
        case 90:
          _this.rotateAngle = 180;
          _this.rotateClass = "rotate180";
          break;
        case 180:
          _this.rotateAngle = 270;
          _this.rotateClass = "rotate270";
          break;
        case 270:
          _this.rotateAngle = 0;
          _this.rotateClass = "";
          break;
        default:
          _this.rotateAngle = 0;
          _this.rotateClass = "";
      }
    },
    rotateLeft() {
      var _this = this;

      switch (_this.rotateAngle) {
        case 0:
          _this.rotateAngle = -90;
          _this.rotateClass = "rotate-90";
          break;
        case -90:
          _this.rotateAngle = -180;
          _this.rotateClass = "rotate-180";
          break;
        case -180:
          _this.rotateAngle = -270;
          _this.rotateClass = "rotate-270";
          break;
        case -270:
          _this.rotateAngle = 0;
          _this.rotateClass = "";
          break;
        case 90:
          _this.rotateAngle = 0;
          _this.rotateClass = "";
          break;
        case 180:
          _this.rotateAngle = 90;
          _this.rotateClass = "rotate90";
          break;
        case 270:
          _this.rotateAngle = 180;
          _this.rotateClass = "rotate180";
          break;
        default:
          _this.rotateAngle = 0;
          _this.rotateClass = "";
      }
    },
    zoom(str) {
      var img = this.$refs.eImg,
        imgTop = parseInt(img.style.top.replace(/px/, "")),
        imgLeft = parseInt(img.style.left.replace(/px/, ""));

      if (str == "enlarge") {
        if (img.offsetHeight > 2300) {
          return;
        }
        img.height = img.offsetHeight + 200;
        img.style.top = imgTop - 100 + "px";
        img.style.left = imgLeft - 100 + "px";
      }

      if (str == "narrow") {
        if (img.offsetHeight < 300) {
          return;
        }
        img.height = img.offsetHeight - 200;
        img.style.top = imgTop + 100 + "px";
        img.style.left = imgLeft + 100 + "px";
      }
    },

    zoomMin(str) {
      //滚轮放大缩小
      var img = this.$refs.eImg,
        imgTop = parseInt(img.style.top.replace(/px/, "")),
        imgLeft = parseInt(img.style.left.replace(/px/, ""));

      if (str == "enlarge") {
        if (img.offsetHeight > 2300) {
          return;
        }

        img.height = img.offsetHeight + 30;
        img.style.top = imgTop - 15 + "px";
        img.style.left = imgLeft - 15 + "px";
      }

      if (str == "narrow") {
        if (img.offsetHeight < 200) {
          return;
        }
        img.height = img.offsetHeight - 30;
        img.style.top = imgTop + 15 + "px";
        img.style.left = imgLeft + 15 + "px";
      }
    },

    mouseZoom(id) {
      //滚轮放大缩小
      let el = this.$refs[id],
        dir = "up",
        _this = this;
      if (navigator.userAgent.indexOf("Firefox") > 0) {
        el.addEventListener(
          "DOMMouseScroll",
          function (e) {
            dir = e.detail > 0 ? "Up" : "Down";
            if (dir == "Up") {
              _this.zoomMin("enlarge");
            } else {
              _this.zoomMin("narrow");
            }
            e.preventDefault();
          },
          false
        );
      } else {
        el.onmousewheel = function (e) {
          e = e || window.event;
          dir = e.wheelDelta > 0 ? "Up" : "Down";
          if (dir == "Up") {
            _this.zoomMin("enlarge");
          } else {
            _this.zoomMin("narrow");
          }
          return false;
        };
      }
    },
  },
  watch: {
    imageUrl() {
      this.init();
    },
  },
};
</script>
<style scoped>
[v-cloak] {
  display: none;
}
.wrap {
  position: relative;
}
.view-box {
  position: absolute;
  left: 10px;
  top: 10px;
  right: 10px;
  bottom: 10px;
  overflow: hidden;
  background-color: #f9f9f9;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDM4REQzRkQ1RjQ4MTFFNzkyN0JGNzExOEUzRjg5MTgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDM4REQzRkU1RjQ4MTFFNzkyN0JGNzExOEUzRjg5MTgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowMzhERDNGQjVGNDgxMUU3OTI3QkY3MTE4RTNGODkxOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowMzhERDNGQzVGNDgxMUU3OTI3QkY3MTE4RTNGODkxOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pu17EKMAAAAqSURBVHjaYjx58uR/BvyAEZ8kEwOFYNSAwWAAC6F4BoL/o4E47A0ACDAAxvsEfVTmUO4AAAAASUVORK5CYII=");
}
.loading {
  position: absolute;
  width: 50px;
  left: 50%;
  margin-left: -25px;
  top: 50%;
  margin-top: -25px;
  z-index: 100;
}

.eImg {
  position: absolute;
  cursor: move;
  width: auto;
}

.rotate90 {
  transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
  -o-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
}

.rotate180 {
  transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
}

.rotate270 {
  transform: rotate(270deg);
  -ms-transform: rotate(270deg);
  -webkit-transform: rotate(270deg);
  -o-transform: rotate(270deg);
  -moz-transform: rotate(270deg);
}

.rotate-90 {
  transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  -webkit-transform: rotate(-90deg);
  -o-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
}

.rotate-180 {
  transform: rotate(-180deg);
  -ms-transform: rotate(-180deg);
  -webkit-transform: rotate(-180deg);
  -o-transform: rotate(-180deg);
  -moz-transform: rotate(-180deg);
}

.rotate-270 {
  transform: rotate(-270deg);
  -ms-transform: rotate(-270deg);
  -webkit-transform: rotate(-270deg);
  -o-transform: rotate(-270deg);
  -moz-transform: rotate(-270deg);
}

.tool {
  position: absolute;
  bottom: 0;
  left: 50%;
  right: 0;
  height: 60px;
  width: 240px;
  margin-left: -120px;
}

.tool a {
  display: block;
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  background-color: rgba(0, 0, 0, 0.3);
  color: #fff;
  font-size: 20px;
  float: left;
  margin: 0 10px 0 10px;
  border-radius: 5px;
}

.tool a img {
  display: block;
  width: 20px;
  margin: 10px auto 0 auto;
}
</style>\