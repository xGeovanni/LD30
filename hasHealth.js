/*
 * 
 */
 
"use strict";

function HasHealth(health){
	this.maxHealth = health;
	this.currentHealth = this.maxHealth;

	this.dead = false;

	this.takeDamage = function(amount){
		this.currentHealth -= amount;

		if (this.currentHealth <= 0){
			this.die();
		}
	};

	this.heal = function(amount){
		if (this.currentHealth + amount >= this.maxHealth){
			this.currentHealth = this.maxHealth;
		}
		else{
			this.currentHealth += amount;
		}
	}

	this.healthAsRatio = function(){
		return (this.currentHealth / this.maxHealth);
	}

	this.die = function(){
		this.dead = true;
	};
};