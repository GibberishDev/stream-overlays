// #region utils
function triggerReflow(element) {
	element.style.animation = 'none';
	void element.offsetHeight;
	element.style.animation = null;
}
class HSV {
    constructor(h,s,v) {
        this.h = h
        this.s = s
        this.v = v
    }
    toHex() {
        var sat = this.s / 100
        var val = this.v / 100
        const c = val * sat
        const x = c * (1 - Math.abs((this.h / 60) % 2 - 1))
        const m = val - c
        let r = 0
        let g = 0
        let b = 0

        if (this.h >= 0 && this.h < 60) { r = c; g = x; b = 0
        } else if (this.h < 120) { r = x; g = c; b = 0
        } else if (this.h < 180) { r = 0; g = c; b = x
        } else if (this.h < 240) { r = 0; g = x; b = c
        } else if (this.h < 300) { r = x; g = 0; b = c
        } else { r = c; g = 0; b = x
        }

        const toHex = n =>
            Math.round((n + m) * 255).toString(16).padStart(2, "0")

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`
    }

    fromHex(hex) {
        hex = hex.replace(/^#/, "")
        const r = parseInt(hex.slice(0, 2), 16) / 255
        const g = parseInt(hex.slice(2, 4), 16) / 255
        const b = parseInt(hex.slice(4, 6), 16) / 255
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        const delta = max - min
        let hue = 0
        let sat = 0
        let val = max

        if (delta !== 0) {
            sat = delta / max
            switch (max) {
                case r: hue = ((g - b) / delta) % 6; break
                case g: hue = (b - r) / delta + 2; break
                case b: hue = (r - g) / delta + 4; break
            }
            hue *= 60;
            if (hue < 0) hue += 360
        }
        this.h = hue
        this.s = sat * 100
        this.v = val * 100
        return this
    }
}

var fps = document.getElementById("fps")
var startTime = Date.now()
var frame = 0

function tick() {
  var time = Date.now()
  frame++
  if (time - startTime > 100) {
      fps.innerHTML = Math.floor(frame / ((time - startTime) / 1000)) + " FPS"
      startTime = time
      frame = 0
	}
  window.requestAnimationFrame(tick)
}
tick()

function sanitizeHTML(html) {
    html = html.replace(/<style([\s\S]*?)<\/style>/gi, '')
    html = html.replace(/<script([\s\S]*?)<\/script>/gi, '')
    html = html.replace(/<\/div>/ig, '\n')
    html = html.replace(/<\/li>/ig, '\n')
    html = html.replace(/<li>/ig, '  *  ')
    html = html.replace(/<\/ul>/ig, '\n')
    html = html.replace(/<\/p>/ig, '\n')
    html = html.replace(/<br\s*[\/]?>/gi, "\n")
    html = html.replace(/<[^>]+>/ig, '')
    return html
}
// #endregion