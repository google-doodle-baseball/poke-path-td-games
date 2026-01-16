import { GameScene } from '../../utils/GameScene.js';
import { Element } from '../../utils/Element.js';
import { text } from '../../file/text.js';
import { playSound, playMusic } from '../../file/audio.js';

export class DraftScene extends GameScene {
	constructor(main) {
		super(400, 150);
		this.main = main;
		this.round = 0;

		this.pool;
		this.picks = [];
		this.header.removeChild(this.closeButton);
		this.render();
	}

	render() {
		this.title.innerHTML = text.challenge.draft.title[this.main.lang].toUpperCase();

		this.roundLabel = new Element(this.container, { className: 'tutorial-scene-title' }).element;
		this.pokemonContainer = new Element(this.container, { className: 'draft-scene-pokemon-container' }).element;
		this.pokemon = []

		for (let i = 0; i < 3; i++) {
			this.pokemon[i] = new Element(this.pokemonContainer, { className: 'draft-scene-pokemon' }).element;
			this.pokemon[i].label = new Element(this.pokemon[i], { className: 'draft-scene-pokemon-label stroke' }).element;
			this.pokemon[i].addEventListener('click', () => { this.selectPick(i) });
			this.pokemon[i].addEventListener('mouseenter', () => { playSound('hover1', 'ui') });
		}
	}

	update() {
		this.roundLabel.innerHTML = `${text.challenge.draft.round[this.main.lang].toUpperCase()} ${this.round+1}/10`;
		this.generatePicks();
	}

	generatePicks() {
	    if (!this.pool || this.pool.length === 0) return;

	    for (let i = this.pool.length - 1; i > 0; i--) {
	        const j = Math.floor(Math.random() * (i + 1));
	        [this.pool[i], this.pool[j]] = [this.pool[j], this.pool[i]];
	    }

	    const picksCount = Math.min(3, this.pool.length);
	    this.currentPicks = this.pool.slice(0, picksCount); 

	    for (let i = 0; i < this.pokemon.length; i++) {
	        if (this.currentPicks[i]) {
	            this.pokemon[i].style.backgroundImage = `url("${this.currentPicks[i].sprite.base}")`;
	            this.pokemon[i].label.innerHTML = (this.currentPicks[i].alias != undefined)
	                ? this.currentPicks[i].alias.toUpperCase()
	                : this.currentPicks[i].name[this.main.lang].toUpperCase();
	        } else {
	            this.pokemon[i].style.backgroundImage = '';
	            this.pokemon[i].label.innerHTML = '';
	        }
	    }
	}

	selectPick(i) {
		playSound('select', 'ui')
	    const pickedPokemon = this.currentPicks[i];
	    if (!pickedPokemon) return;

	    this.main.team.addPokemon(pickedPokemon);
	    this.main.box.removePokemon(pickedPokemon);
	    this.main.UI.update();
	    const indexInPool = this.pool.indexOf(pickedPokemon);
	    if (indexInPool !== -1) this.pool.splice(indexInPool, 1);

	    this.round++;
	    if (this.round === 10) this.close();
	    else this.update();
	}

	open() {
		super.open();
		this.round = 0;
		this.pool = [...this.main.team.pokemon, ...this.main.box.pokemon];
		this.picks = [];
		this.update();
	}

	close() {
		super.close();
	}
}