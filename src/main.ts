import './main.css'

import * as u from './utils';

export class Game {
    protected fps = 60;
    protected maxFrameSkip = 10;
    protected skipTicks = 1000 / this.fps;
    protected tick = 0;
    protected isDebug = false;

    protected cashCount = 0;
    protected rawPizzaCount = 0;
    protected pizzaCount = 0;
    protected deliveryCount = 0;
    protected employeeCount = 0;
    protected ovenCount = 0;
    protected driverCount = 0;

    protected pizzaPrice = 3;
    protected employeePrice = 7;
    protected ovenPrice = 25;
    protected driverPrice = 6;

    protected upEmployeePrice = 2;
    protected upOvenPrice = 3;
    protected upDriverPrice = 4;

    protected upEmployeeCount = 0;
    protected upOvenCount = 0;
    protected upDriverCount = 0;

    protected employeeSpeed = 1;
    protected ovenSpeed = 1;
    protected driverSpeed = 1;

    protected $cashCount!: HTMLSpanElement;
    protected $rawPizzaCount!: HTMLSpanElement;
    protected $pizzaCount!: HTMLSpanElement;
    protected $employeeCount!: HTMLSpanElement;
    protected $ovenCount!: HTMLSpanElement;
    protected $driverCount!: HTMLSpanElement;
    protected $toDeliverCount!: HTMLSpanElement;
    protected $salesCount!: HTMLSpanElement;
    
    protected $pizzaPrice!: HTMLSpanElement;
    protected $employeePrice!: HTMLSpanElement;
    protected $ovenPrice!: HTMLSpanElement;
    protected $driverPrice!: HTMLSpanElement;
    protected $upEmployeePrice!: HTMLSpanElement;
    protected $upOvenPrice!: HTMLSpanElement;
    protected $upDriverPrice!: HTMLSpanElement;

    protected $prepare!: HTMLButtonElement;
    protected $bake!: HTMLButtonElement;
    protected $deliver!: HTMLButtonElement;

    protected $upEmployee!: HTMLButtonElement;
    protected $upOven!: HTMLButtonElement;
    protected $upDriver!: HTMLButtonElement;

    protected $upEmployeeCount!: HTMLSpanElement;
    protected $upOvenCount!: HTMLSpanElement;
    protected $upDriverCount!: HTMLSpanElement;

    protected $hireEmployee!: HTMLButtonElement;
    protected $buyOven!: HTMLButtonElement;
    protected $hireDriver!: HTMLButtonElement;

    protected prepareDeltaTimer = 0;
    protected bakeDeltaTimer = 0;
    protected deliverDeltaTimer = 0;
        
    init() {
        this.debug('init');
        // setup 

        this.$cashCount = u.$('#cash-count')!;
        this.$rawPizzaCount = u.$('#rawpizza-count')!;
        this.$pizzaCount = u.$('#pizza-count')!;
        this.$employeeCount = u.$('#employee-count')!;
        this.$ovenCount = u.$('#oven-count')!;
        this.$driverCount = u.$('#driver-count')!;
        this.$toDeliverCount = u.$('#todeliver-count')!;
        this.$salesCount = u.$('#sales-count')!;

        this.$pizzaPrice = u.$('#pizza-price')!;
        this.$employeePrice = u.$('#employee-price')!;
        this.$ovenPrice = u.$('#oven-price')!;
        this.$driverPrice = u.$('#driver-price')!;

        this.$upEmployeeCount = u.$('#up-employee-count')!;
        this.$upOvenCount = u.$('#up-oven-count')!;
        this.$upDriverCount = u.$('#up-driver-count')!;

        this.$prepare = u.$('#prepare')!;
        this.$bake = u.$('#bake')!;
        this.$deliver = u.$('#deliver')!;

        this.$upEmployee = u.$('#up-employee')!;
        this.$upOven = u.$('#up-oven')!;
        this.$upDriver = u.$('#up-driver')!;

        this.$upEmployeePrice = u.$('#up-employee-price')!;
        this.$upOvenPrice = u.$('#up-oven-price')!;
        this.$upDriverPrice = u.$('#up-driver-price')!;

        this.$hireEmployee = u.$('#hire-employee')!;
        this.$buyOven = u.$('#buy-oven')!;
        this.$hireDriver = u.$('#hire-driver')!;

        this.$prepare.addEventListener('click', () => {
            this.prepare();
        });

        this.$bake.addEventListener('click', () => {
            this.bake();
        });

        this.$deliver.addEventListener('click', () => {
           this.deliver(); 
        });

        this.$hireEmployee.addEventListener('click', () => {
            if (this.cashCount >= this.employeePrice) {
                this.employeeCount += 1
                this.cashCount -= this.employeePrice;
                this.employeePrice *= 1.125;
            }
        });

        this.$buyOven.addEventListener('click', () => {
           if (this.cashCount >= this.ovenPrice) {
                this.ovenCount += 1
                this.cashCount -= this.ovenPrice;
                this.ovenPrice *= 1.085;
            }
        });

        this.$hireDriver.addEventListener('click', () => {
            if (this.cashCount >= this.driverPrice) {
                this.driverCount += 1
                this.cashCount -= this.driverPrice;
                this.driverPrice *= 1.1;
            }
        });

        this.$upEmployee.addEventListener('click', () => {
            if (this.upEmployeeCount >= 100) {
                return;
            }

            if (this.cashCount < this.upEmployeePrice) {
                return;
            }

            this.cashCount -= this.upEmployeePrice;
            this.upEmployeeCount += 1;
            this.employeeSpeed *= 1.05;
            this.upEmployeePrice *= 1.1;
        });

        this.$upOven.addEventListener('click', () => {
            if (this.upOvenCount >= 100) {
                return;
            }

            if (this.cashCount < this.upOvenPrice) {
                return;
            }

            this.cashCount -= this.upOvenPrice;
            this.upOvenCount += 1;
            this.ovenSpeed *= 1.05;
            this.upOvenPrice *= 1.1;
        });

        this.$upDriver.addEventListener('click', () => {
            if (this.upDriverCount >= 100) {
                return;
            }

            if (this.cashCount < this.upDriverPrice) {
                return;
            }


            this.cashCount -= this.upDriverPrice;
            this.upDriverCount += 1;
            this.driverSpeed *= 1.05;
            this.upDriverPrice *= 1.1;
        });
    }

    prepare(count = 1) {
        this.rawPizzaCount += count;
    }

    bake(ovenCount = 1) {
        if (ovenCount === 0 || this.rawPizzaCount === 0) {
            return;
        }

        const count = this.rawPizzaCount >= ovenCount ? ovenCount : this.rawPizzaCount;

        this.rawPizzaCount -= count;
        this.pizzaCount += count;
    }

    deliver(driverCount = 1) {
        if (driverCount === 0 || this.pizzaCount === 0) {
            return;
        }
        
        const count = this.pizzaCount >= driverCount ? driverCount : this.pizzaCount;

        this.pizzaCount -= count;
        this.deliveryCount += count;
        this.cashCount += this.pizzaPrice * count;
        this.pizzaPrice *= 1.001 * count;
    }

    update(tick: number) {
        this.tick = tick;

        this.debug('update');

        if (this.tick >= this.prepareDeltaTimer) {
            this.prepare(this.employeeCount);
            this.prepareDeltaTimer = this.tick + (1000 - this.employeeSpeed);
        }

        if (this.tick >= this.bakeDeltaTimer) {
            this.bake(this.ovenCount);
            this.bakeDeltaTimer = this.tick + (1000 - this.ovenSpeed);
        }

        if (this.tick >= this.deliverDeltaTimer) {
            this.deliver(this.driverCount);
            this.deliverDeltaTimer = this.tick + (1000 - this.driverSpeed);
        }
    }

    draw() {
        this.debug('draw');

        this.$cashCount.innerHTML = `${this.cashCount}`;
        this.$pizzaCount.innerHTML = `${this.pizzaCount}`;
        this.$rawPizzaCount.innerHTML = `${this.rawPizzaCount}`;
        this.$rawPizzaCount.innerHTML = `${this.rawPizzaCount}`;
        this.$toDeliverCount.innerHTML = `${this.pizzaCount}`;
        this.$salesCount.innerHTML = `${this.deliveryCount}`;

        this.$pizzaPrice.innerHTML = `${this.pizzaPrice.toFixed(2)}`;
        this.$employeePrice.innerHTML = `${this.employeePrice.toFixed(2)}`;
        this.$ovenPrice.innerHTML = `${this.ovenPrice.toFixed(2)}`;
        this.$driverPrice.innerHTML = `${this.driverPrice.toFixed(2)}`;
        this.$upEmployeePrice.innerHTML = `${this.upEmployeePrice.toFixed(2)}`;
        this.$upOvenPrice.innerHTML = `${this.upOvenPrice.toFixed(2)}`;
        this.$upDriverPrice.innerHTML = `${this.upDriverPrice.toFixed(2)}`;

        this.$employeeCount.innerHTML = `${this.employeeCount}`;
        this.$ovenCount.innerHTML = `${this.ovenCount}`;
        this.$driverCount.innerHTML = `${this.driverCount}`;

        this.$upEmployeeCount.innerHTML = `${this.upEmployeeCount}`;
        this.$upOvenCount.innerHTML = `${this.upOvenCount}`;
        this.$upDriverCount.innerHTML = `${this.upDriverCount}`;
    }

    run = (() => {
        this.debug('run');

        let loops = 0;
        let nextGameTick = (new Date).getTime();
        let startTime = (new Date).getTime();

        return () => {
            this.debug('loop');
            loops = 0;
            while (/*!this.paused && */(new Date).getTime() > nextGameTick && loops < this.maxFrameSkip) {
                this.update(nextGameTick - startTime);
                nextGameTick += this.skipTicks;
                loops++;
            }
            this.draw();
        }
    })();

    start() {
        this.run();
        window.requestAnimationFrame(this.start.bind(this));
    }

    debug(...data: any[]) {
        if (this.isDebug) {
            console.log(...data);
        } 
    }
}

const game = new Game();

game.init();
game.start();
