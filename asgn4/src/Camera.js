class Camera{
    //used chatGPT to figure out how to adapt the code to my implementation of vector3
    constructor(){
        this.eye = new Vector3([2,0.5,6.5]);
        this.at = new Vector3([0,0,-100]);
        this.up = new Vector3([0,2,0]);
        this.fov = 60.0; // Initialize Field of View
    }

    forward() {
        var f = new Vector3(this.at.elements);
        f.sub(this.eye);
        f.normalize();

        var newEye = new Vector3(this.eye.elements);
        newEye.add(f);

        let mapX = Math.floor(newEye.elements[0] + MAP_SIZE_X / 2 + 0.5);
        let mapZ = Math.floor(newEye.elements[2] + MAP_SIZE_Z / 2 + 0.5);

        if (mapX >= 0 && mapX < MAP_SIZE_X && mapZ >= 0 && mapZ < MAP_SIZE_Z) {
            if (g_map[mapZ][mapX] === 0) {
                // Move only if the target cell is empty
                this.eye.add(f);
                this.at.add(f);
            }
        } else {
             //avoid getting stuck in the map (thanks chatGPT)
             this.eye.add(f);
             this.at.add(f);
        }
    }

    back() {
        var f = new Vector3(this.eye.elements);
        f.sub(this.at);
        f.normalize();

        var newEye = new Vector3(this.eye.elements);
        newEye.add(f);

        let mapX = Math.floor(newEye.elements[0] + MAP_SIZE_X / 2 + 0.5);
        let mapZ = Math.floor(newEye.elements[2] + MAP_SIZE_Z / 2 + 0.5);

        //collision check
        if (mapX >= 0 && mapX < MAP_SIZE_X && mapZ >= 0 && mapZ < MAP_SIZE_Z) {
            if (g_map[mapZ][mapX] === 0) {
                // Move only if the target cell is empty
                this.eye.add(f);
                this.at.add(f);
            }
        } else {
             this.eye.add(f);
             this.at.add(f);
        }
    }

    left() {
        var f = new Vector3(this.at.elements);
        f.sub(this.eye);
        var s = Vector3.cross(this.up, f);
        s.normalize();

        var newEye = new Vector3(this.eye.elements);
        newEye.add(s);

        let mapX = Math.floor(newEye.elements[0] + MAP_SIZE_X / 2 + 0.5);
        let mapZ = Math.floor(newEye.elements[2] + MAP_SIZE_Z / 2 + 0.5);

        if (mapX >= 0 && mapX < MAP_SIZE_X && mapZ >= 0 && mapZ < MAP_SIZE_Z) {
            if (g_map[mapZ][mapX] === 0) {
                this.eye.add(s);
                this.at.add(s);
            }
        } else {
             this.eye.add(s);
             this.at.add(s);
        }
    }

    right() {
        var f = new Vector3(this.at.elements);
        f.sub(this.eye);
        var s = Vector3.cross(f, this.up);
        s.normalize();

        var newEye = new Vector3(this.eye.elements);
        newEye.add(s);

        let mapX = Math.floor(newEye.elements[0] + MAP_SIZE_X / 2 + 0.5);
        let mapZ = Math.floor(newEye.elements[2] + MAP_SIZE_Z / 2 + 0.5);

        if (mapX >= 0 && mapX < MAP_SIZE_X && mapZ >= 0 && mapZ < MAP_SIZE_Z) {
            if (g_map[mapZ][mapX] === 0) {
                this.eye.add(s);
                this.at.add(s);
            }
        } else {
             this.eye.add(s);
             this.at.add(s);
        }
    }

    panLeft(angle = 5) {
        let f = new Vector3(this.at.elements);
        f.sub(this.eye); // f = at - eye
        let rotMat = new Matrix4().setRotate(angle, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        let f_prime = rotMat.multiplyVector3(f);
        this.at = new Vector3(this.eye.elements).add(f_prime);
    }

    panRight(angle = 5) {
        let f = new Vector3(this.at.elements);
        f.sub(this.eye); // f = at - eye
        let rotMat = new Matrix4().setRotate(-angle, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        let f_prime = rotMat.multiplyVector3(f);
        this.at = new Vector3(this.eye.elements).add(f_prime);
    }
} 