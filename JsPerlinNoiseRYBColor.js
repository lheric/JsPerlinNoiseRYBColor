// Perlin Noise Generator
function PerlinNoiseGenerator() {
    this.f000 = new Vector3D(1.0, 1.0, 1.0);
    this.f001 = new Vector3D(0.163, 0.373, 0.6);
    this.f010 = new Vector3D(1.0, 1.0, 0.0);
    this.f011 = new Vector3D(0.0, 0.66, 0.2);
    this.f100 = new Vector3D(1.0, 0.0, 0.0);
    this.f101 = new Vector3D(0.5, 0.5, 0.0);
    this.f110 = new Vector3D(1.0, 0.5, 0.0);
    this.f111 = new Vector3D(0.2, 0.094, 0.0);



    this.canvas = document.createElement('canvas');
    this.canvas.height = 0;
    this.canvas.width = 0;

    this.ctx = this.canvas.getContext('2d');
}

PerlinNoiseGenerator.prototype = 
{

    generateTexture: function (weight_r, weight_y, weight_b, width, height, density) {
      // var width = 128;
      // var height = 128;
      // var density = 8.0;
      if(this.canvas.height != height || this.canvas.width != width) {
        this.canvas.width = width;
        this.canvas.height = height;

        this.random_noise = new Array(width);
        for (var i = 0; i < width; i++)
            this.random_noise[i] = new Array(height);

        this.perlin_noise_r = new Array(width);
        for (var i = 0; i < width; i++)
            this.perlin_noise_r[i] = new Array(height);
        this.perlin_noise_y = new Array(width);
        for (var i = 0; i < width; i++)
            this.perlin_noise_y[i] = new Array(height);
        this.perlin_noise_b = new Array(width);
        for (var i = 0; i < width; i++)
            this.perlin_noise_b[i] = new Array(height);  
      }

      this.density = density;
      this.generate_random_noise();
      this.get_perlin_noise(this.perlin_noise_r);
      this.generate_random_noise();
      this.get_perlin_noise(this.perlin_noise_y);
      this.generate_random_noise();
      this.get_perlin_noise(this.perlin_noise_b);
      this.getBlendingResult(this.perlin_noise_r, this.perlin_noise_y, this.perlin_noise_b, 
                             weight_r, weight_y, weight_b);
      return this.canvas.toDataURL();
    },
    


    /// random niose
    generate_random_noise: function() {
      for (var i = 0; i < this.canvas.width; i++) {
        for (var j = 0; j < this.canvas.height; j++) {
            var gray = Math.round(Math.random() * 255);
            this.random_noise[i][j] = gray;
        }
      }
    },
    
    /// blend ryb panels and convert to rgb
    getBlendingResult: function(r_panel, y_panel, b_panel, wieght_r, wieght_y, weight_b) {
        for (var x = 0; x < this.canvas.width; x++) {
            for (var y = 0; y < this.canvas.height; y++) {
                var rgb = this.ryb2rgb(r_panel[x][y]*wieght_r, y_panel[x][y]*wieght_y, b_panel[x][y]*weight_b);
                var r = Math.max(0, Math.min(Math.round(rgb.x), 255));
                var g = Math.max(0, Math.min(Math.round(rgb.y), 255));
                var b = Math.max(0, Math.min(Math.round(rgb.z), 255));
                this.ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + 255 + ")";
                this.ctx.fillRect(x, y, 1, 1);
            }
        }
    },
        /// Helper functions

    smooth_noise_interpolation: function(x, y) {
        var width = this.canvas.width;
        var height = this.canvas.height;
        //get fractional part of x and y
        var fractX = x - Math.floor(x);
        var fractY = y - Math.floor(y);
        //wrap around
        var x1 = (Math.floor(x) + width) % width;
        var y1 = (Math.floor(y) + height) % height;
        //neighbor values
        var x2 = (x1 + width - 1) % width;
        var y2 = (y1 + height - 1) % height;
        //console.log(random_noise.palette[random_noise.buffer[random_noise.index(x1,y1)]])
        //smooth the noise with bilinear interpolation
        var value = 0.0;
        value += fractX * fractY * this.random_noise[x1][y1];
        value += fractX * (1 - fractY) * this.random_noise[x1][y2];
        value += (1 - fractX) * fractY * this.random_noise[x2][y1];
        value += (1 - fractX) * (1 - fractY) * this.random_noise[x2][y2];
        return value;
    },

    get_perlin_noise: function(dest) {
        for (var x = 0; x < this.canvas.width; x++) {
            for (var y = 0; y < this.canvas.height; y++) {
                var size = this.density;
                var value = 0.0;
                var initialSize = size;
                while (size >= 1) {
                    value += this.smooth_noise_interpolation(x / size, y / size) * size;
                    size /= 2.0;
                }
                value = value / (initialSize * 2); //var oneMinusPercent = 1-percent;
                dest[x][y] = value;
            }
        }
    },

    ryb2rgb: function(r, y, b) {
        r /= 255.0;
        y /= 255.0;
        b /= 255.0;

        var one_minus_r = 1 - r;
        var one_minus_y = 1 - y;
        var one_minus_b = 1 - b;
        var rgb = this.f000.multiply(one_minus_r * one_minus_y * one_minus_b)
            .add(this.f001.multiply(one_minus_r * one_minus_y * b))
            .add(this.f010.multiply(one_minus_r * y * one_minus_b))
            .add(this.f100.multiply(r * one_minus_y * one_minus_b))
            .add(this.f011.multiply(one_minus_r * y * b))
            .add(this.f101.multiply(r * one_minus_y * b))
            .add(this.f110.multiply(r * y * one_minus_b))
            .add(this.f111.multiply(r * y * b));
        rgb = rgb.multiply(255);
        return rgb;
    }   
};

// vector3D
function Vector3D(x, y, z)
{
        this.x = x !== undefined ? x : 0;
        this.y = y !== undefined ? y : 0;
        this.z = z !== undefined ? z : 0;
}
Vector3D.prototype =
{
        add: function(b)
        {
                return new Vector3D(this.x + b.x, this.y + b.y, this.z + b.z);
        },
        subtract: function(b)
        {
                return new Vector3D(this.x - b.x, this.y - b.y, this.z - b.z);
        },
        multiply: function(scalar)
        {
                return new Vector3D(this.x * scalar, this.y * scalar, this.z * scalar);
        },
        scale: function(b)
        {
                return new Vector3D(this.x * b.x, this.y * b.y, this.z * b.z);
        },
        invert: function(b)
        {
                this.x *= -1;
                this.y *= -1;
                this.z *= -1;
                return this;
        },
        length: function()
        {
                return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        },
        lengthSquared: function()
        {
                return this.x * this.x + this.y * this.y + this.z * this.z;
        },
        normalize: function()
        {
                var l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
                this.x /= l;
                this.y /= l;
                this.z /= l;
                return this;
        },
        dot: function(b)
        {
                return this.x * b.x + this.y * b.y + this.z * b.z;
        },
        cross: function(b)
        {
                return new Vector3D(this.y * b.z - b.y * this.z,
                        b.x * this.z - this.x * b.z,
                        this.x * b.y - b.x * this.y);
        },
        angleFrom: function(b)
        {
                var dot = this.x * b.x + this.y * b.y + this.z * b.z;
                var mod1 = this.x * this.x + this.y * this.y + this.z * this.z;
                var mod2 = b.x * b.x + b.y * b.y + b.z * b.z;
                var mod = Math.sqrt(mod1) * Math.sqrt(mod2);
                if(mod === 0) return null;
                var theta = dot / mod;
                if(theta < -1) return Math.acos(-1);
                if(theta > 1) return Math.acos(1);
                return Math.acos(theta);
        },
        distanceFrom: function(b)
        {
                var dx = b.x - this.x, dy = b.y - this.y, dz = b.z - this.z;
                return Math.sqrt(dx * dx + dy * dy + dz * dz);
        },
        yRotate: function(a, out)
        {
                if(!out)
                        out = new Vector3D(0, 0, 0);
                var x = this.x, y = this.y, z = this.z;
                var sinA = Math.sin(a);
                var cosA = Math.cos(a);
                out.x = x * cosA - z * sinA;
                out.y = y;
                out.z = x * sinA + z * cosA;
                return out;
        }
};

