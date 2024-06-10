import './main.css'

import * as u from './utils';

export class Game {
    protected fps = 60;
    protected maxFrameSkip = 10;
    protected skipTicks = 1000 / this.fps;
    protected tick = 0;
    protected isDebug = false;

    protected cashCount = 100;
    protected rawPizzaCount = 0;
    protected pizzaCount = 0;
    protected deliveryCount = 0;
    protected employeeCount = 0;
    protected ovenCount = 0;
    protected driverCount = 0;

    protected pizzaPrice = 5;
    protected employeePrice = 10;
    protected ovenPrice = 25;
    protected driverPrice = 7;
    protected deliveryExperienceThreshold = 20;

    protected $cashCount!: HTMLSpanElement;
    protected $rawPizzaCount!: HTMLSpanElement;
    protected $pizzaCount!: HTMLSpanElement;
    protected $employeeCount!: HTMLSpanElement;
    protected $ovenCount!: HTMLSpanElement;
    protected $driverCount!: HTMLSpanElement;
    protected $toDeliverCount!: HTMLSpanElement;
    
    protected $pizzaPrice!: HTMLSpanElement;
    protected $employeePrice!: HTMLSpanElement;
    protected $ovenPrice!: HTMLSpanElement;
    protected $driverPrice!: HTMLSpanElement;

    protected $prepare!: HTMLButtonElement;
    protected $bake!: HTMLButtonElement;
    protected $deliver!: HTMLButtonElement;

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

        this.$pizzaPrice = u.$('#pizza-price')!;
        this.$employeePrice = u.$('#employee-price')!;
        this.$ovenPrice = u.$('#oven-price')!;
        this.$driverPrice = u.$('#driver-price')!;

        this.$prepare = u.$('#prepare')!;
        this.$bake = u.$('#bake')!;
        this.$deliver = u.$('#deliver')!;

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
                this.employeePrice *= 1.1;
            }
        });

        this.$buyOven.addEventListener('click', () => {
           if (this.cashCount >= this.ovenPrice) {
                this.ovenCount += 1
                this.cashCount -= this.ovenPrice;
                this.ovenPrice *= 1.1;
            }
        });

        this.$hireDriver.addEventListener('click', () => {
            if (this.cashCount >= this.driverPrice) {
                this.driverCount += 1
                this.cashCount -= this.driverPrice;
                this.driverPrice *= 1.1;
            }
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
        this.cashCount += this.pizzaPrice;

        if (this.deliveryCount > 0 && 0 === (this.deliveryCount % this.deliveryExperienceThreshold)) {
            this.pizzaPrice *= 1.0025;
        }
    }

    update(tick: number) {
        this.tick = tick;

        this.debug('update');

        if (this.tick >= this.prepareDeltaTimer) {
            this.prepare(this.employeeCount);
            this.prepareDeltaTimer = this.tick + 1000;
        }

        if (this.tick >= this.bakeDeltaTimer) {
            this.bake(this.ovenCount);
            this.bakeDeltaTimer = this.tick + 1000;
        }

        if (this.tick >= this.deliverDeltaTimer) {
            this.deliver(this.driverCount);
            this.deliverDeltaTimer = this.tick + 1000;
        }

        console.log(
            this.rawPizzaCount,

        )
    }

    draw() {
        this.debug('draw');

        this.$cashCount.innerHTML = `${this.cashCount}`;
        this.$pizzaCount.innerHTML = `${this.pizzaCount}`;
        this.$rawPizzaCount.innerHTML = `${this.rawPizzaCount}`;
        this.$rawPizzaCount.innerHTML = `${this.rawPizzaCount}`;
        this.$toDeliverCount.innerHTML = `${this.pizzaCount}`;

        this.$pizzaPrice.innerHTML = `${this.pizzaPrice.toFixed(2)}`;
        this.$employeePrice.innerHTML = `${this.employeePrice.toFixed(2)}`;
        this.$ovenPrice.innerHTML = `${this.ovenPrice.toFixed(2)}`;
        this.$driverPrice.innerHTML = `${this.driverPrice.toFixed(2)}`;

        this.$employeeCount.innerHTML = `${this.employeeCount}`;
        this.$ovenCount.innerHTML = `${this.ovenCount}`;
        this.$driverCount.innerHTML = `${this.driverCount}`;
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
