var abilityFunc = {}
var passiveData = {}

abilityFunc["Basic"] = function (self,target) {// All Basic Attacks
	self.sendAttack()
}

//-- PASSIVE ABILITIES --------------------------

passiveData["None"] = {name : "", stats : {}}

passiveData["Might"] = {name : "Might", stats : {atkPct : .1}}

passiveData["Vitality"] ={name : "Vitality", stats : {defPct : .12, atkPct : .06}}

passiveData["Juggernaut"] ={name : "Juggernaut", stats : {hpPct : .25}}

passiveData["Keen Eye"] ={name : "Keen Eye", stats : {accPct : .1}}

passiveData["Critical Eye"] ={name : "Critical Eye", stats : {crit : 12}}

passiveData["Critical Strike"] ={name : "Critical Eye", stats : {critMod : .35}}

passiveData["Intellect"] ={name : "Intellect", stats : {matkPct : .1}}

passiveData["Wisdom"] ={name : "Wisdom", stats : {apMod : 2}}

passiveData["Mind"] ={name : "Mind", stats : {mdefPct : .1, accPct : .1}}

passiveData["Consolidate"] ={name : "Consolidate", stats : {mdefPct : .05, defPct : .05}}

passiveData["Dark Arts"] ={name : "Dark Arts", stats : {atkPct : .09, matkPct : .09}}

passiveData["Dark Precision"] ={name : "Dark Precision", stats : {acc : 50, crit : 10}}

//-- ATTACK ABILITIES ---------------------------

abilityFunc["Slash"] = function (self,target) {
	self.sendAttack({atk : self.atk * 1.6, matk : 0})
}

abilityFunc["Slash II"] = function (self,target) {
	self.sendAttack({atk : self.atk * 2.2, matk : 0})
}

abilityFunc["Cheap Shot"] = function (self,target) {
	self.sendAttack({dmg : self.atk * 1.1})
}

abilityFunc["Cheap Shot II"] = function (self,target) {
	self.sendAttack({dmg : self.atk * 1.6})
}

abilityFunc["Kidney Shot"] = function (self,target) {
	self.sendAttack({atk : self.acc * 1.6, matk : 0}) 
}

abilityFunc["Kidney Shot II"] = function (self,target) {
	self.sendAttack({atk : self.acc * 2.2, matk : 0}) 
}

abilityFunc["Puncture"] = function (self,target) {
	self.sendAttack({dmg : self.acc * 1.1})
}

abilityFunc["Puncture II"] = function (self,target) {
	self.sendAttack({dmg : self.acc * 1.7})
}

abilityFunc["Stab"] = function (self,target) {
	self.sendAttack({atk : self.atk*1.6, matk : 0, critMod : self.critMod + 0.5})
}

abilityFunc["Stab II"] = function (self,target) {
	self.sendAttack({atk : self.atk*2.3, matk : 0, critMod : self.critMod + 1 })
}

abilityFunc["Mind Blast"] = function (self,target) {
	self.sendAttack({atk : 0, matk : self.matk*1.6}) 
}

abilityFunc["Mind Blast II"] = function (self,target) {
	self.sendAttack({atk : 0, matk : self.matk*2.2}) 
}

abilityFunc["Dark Slash"] = function (self,target) {
	self.sendAttack({atk : self.atk * 1.3, matk : self.matk*1.3}) 
}

abilityFunc["Unholy Slash"] = function (self,target) {
	var result = self.sendAttack({atk : self.atk * 1.5, matk : self.matk*1.5}) 
	if ( (result && ! result.missed) ){
		self.receiveHeal(result.totalDamage * 0.08)
	}
}

abilityFunc["Unholy Slash II"] = function (self,target) {
	var result = self.sendAttack({atk : self.atk * 2, matk : self.matk*2}) 
	if ( (result && ! result.missed) ){
		self.receiveHeal(result.totalDamage * 0.1)
	}
}

abilityFunc["Divine Strike"] = function (self,target) {
	var result = self.sendAttack({atk : self.atk * 1.4, matk : 0})
	self.receiveHeal(self.matk*.2)
}

abilityFunc["Divine Strike II"] = function (self,target) {
	var result = self.sendAttack({atk : self.atk * 1.8, matk : 0})
	self.receiveHeal(self.matk*.5)
}

abilityFunc["Twilight Strike"] = function (self,target) {
	var result = self.sendAttack({dmg : (self.matk + self.atk)*1.1})
}

abilityFunc["Divine Smite"] = function (self, target) {
	self.sendAttack({atk : 0, matk : (self.matk + self.acc) * 1.5})
	self.party.addEffect({name : "Divine Smite", turns : 4,
			stats : {acc : .15, matk : .15}})
}

abilityFunc["Templar Shield"] = function (self, target) {
	self.sendAttack({atk : self.atk * 1.5, matk : self.matk * 2})
}


//-- BUFF ABILITIES -----------------------------

abilityFunc["Vicious Strike"] = function (self,target) {
	self.sendAttack({atk : self.atk * 1.4, matk : 0})
	self.addEffect({name : "Vicious Strike", turns : 3, stats : {atk : .25}}) 
}

abilityFunc["Vicious Strike II"] = function (self,target) {
	self.sendAttack({atk : self.atk * 2, matk : 0}) 
	self.addEffect({name : "Vicious Strike", turns : 4, stats : {atk : .25}})
}

abilityFunc["Magic Missile"] = function (self,target) {
	self.sendAttack({matk : self.matk * 1.4, atk : 0})
	self.addEffect({name : "Magic Missile", turns : 3, stats : {matk : .25}}) 
}

abilityFunc["Magic Missile II"] = function (self,target) {
	self.sendAttack({matk : self.matk * 2, atk : 0}) 
	self.addEffect({name : "Magic Missile", turns : 4, stats : {matk : .25}})
}

abilityFunc["Shield Slam"] = function (self,target) {
	self.sendAttack({atk : self.def * 1.4, matk : 0})
	self.addEffect({name : "Shield Slam", turns : 3, stats : {def : .4} })	
}

abilityFunc["Shield Slam II"] = function (self,target) {
	self.sendAttack({atk : self.def * 2.3, matk : 0})
	self.addEffect({name : "Shield Slam", turns : 4, stats : {def : .6} })	
}

abilityFunc["Enrage"] = function (self,target) {
	self.addEffect({name : "Enrage", turns : 4, stats : {atk : .6} })	
}

abilityFunc["Protect"] = function (self,target) {
	self.addEffect({name : "Protect", turns : 4, stats : {mdef : .5} })	
}

abilityFunc["Holy Blessing"] = function (self, target) {
	self.party.addEffect({name : "Holy Blessing", turns : 6, stats : {mdef : .5, atk : .15}})
}

abilityFunc["Overwhelm"] = function (self,target) {
	self.party.addEffect({name : "Overwhelm", turns : 4, stats : {atk : .25, matk : .25} })	
}

abilityFunc["Blind Fury"] = function (self,target) {
	self.addEffect({name : "Blind Fury", turns : 5, stats : {crit : 60, acc : -.25}})
}

abilityFunc["Ambush"] = function (self,target) {
	var result = self.sendAttack({atk : (self.atk + self.acc)*3, matk : 0})
	if ( (result && ! result.missed) ){
		target.addEffect({name : "Ambush", turns : 1, debuff : true, stats : {atk : -.5}})
	}
}

abilityFunc["Sunder II"] = function (self,target) {
	var result = self.sendAttack({atk : self.atk*1.8, matk : 0})
	if ( (result && ! result.missed) ){
		target.addEffect({name : "Sunder", turns : 3, debuff : true, stats : {def : -.35}})
	}
}

abilityFunc["Taunt"] = function (self,target) {
	var location = location || [0,0,0,0,0,0]
	var party = self.party
	for (var  n=0;n<3;n++ ){ 
		if ( party.frontRow[n] == self ){ 	
			location[n*2 +1] = 1
		}
		if ( party.backRow[n] == self ){
			location[n*2] = 1
		}		
	}	

	target.addEffect({name : "Taunt", trigger : "OnAttack", debuff : true,
		dmgFunc : function (attack) {
			attack.damageRatio = location
			return attack
	}})
}

abilityFunc["Berserk Smash"] = function (self,target) { 
	var result = self.sendAttack({atk : self.atk*1.8, matk : 0})
	if ( (result && result.crit) ){
		self.addEffect({name : "Berserk Smash", stacks : true, trigger : "Permanent", 
				stats : {atk : .15}})
	}
}



//-- DEFENSE ABILITIES -----------------------------

abilityFunc["Block"] = function (self,target) {
	self.addEffect({name : "Block", trigger : "OnDamage", stats : {atk : 0}})
}

abilityFunc["Shield"] = function (self,target) {
	self.addEffect({name : "Shield", trigger : "OnDamage", stats : {matk : 0}})
}

abilityFunc["Holy Shield"] = function (self,target) {
	self.party.addEffect({name : "Shield", trigger : "OnDamage", stats : {matk : 0}})
}

abilityFunc["Evade"] = function (self,target) {
	self.addEffect({name : "Evade", trigger : "OnDamage", stats : {atk : 0, matk : 0, dmg : 0}})
}

//-- DEBUFF ABILITIES ---------------------------

abilityFunc["Terrify"] = function (self,target) {
	self.sendAttack({atk : self.atk*1.4, matk : self.matk * 1.4})
	target.addEffect({name : "Terrify",turns : 2, debuff : true, stats : {mdef : -.3}})
}

abilityFunc["Rend"] = function (self,target) {
	target.addEffect({name : "Rend",turns : 2, debuff : true, stats : {def : -.25}})
}

abilityFunc["Slow"] = function (self,target) {
	target.addEffect({name : "Slow",turns : 3, debuff : true, stats : {eva : -.8}})
	target.addEffect({name : "Slow Poison", trigger : "DamageOnTurn",turns : 3, debuff : true,
		stats : {matk : self.matk*.6, atk : 0, crit : self.crit, hitChance : 100, attacker : self}
	})
}

abilityFunc["Poison"] = function (self,target) {
	target.addEffect({name : "Poison", trigger : "DamageOnTurn",turns : 3, debuff : true,
		stats : {matk : self.matk*.7, atk : 0, crit : 0, hitChance : 100, attacker : self}
	})
}

abilityFunc["Crypt Poison"] = function (self,target) {
	target.addEffect({name : "Crypt Poison", trigger : "DamageOnTurn",turns : 3, debuff : true,
		stats : {matk : self.matk, atk : self.atk, crit : self.crit, hitChance : 100, attacker : self}
	})
}

abilityFunc["Sunder"] = function (self,target) {
	var result = self.sendAttack({atk : self.atk*1.2, matk : 0})
	if ( (result && ! result.missed) ){
	target.addEffect({name : "Sunder", turns : 2, debuff : true, stats : {def : -.25}})
	}
}

//-- Bard Abilities ------------------------


abilityFunc["Serenade"] = function (self,target) {
	self.addEffect({name : "SerenadeSelf",turns : 1, debuff : true, stats : {def : -1}})
	target.addEffect({name : "SerenadeEnemy",turns : 1, debuff : true, stats : {atk : -.5}})
}

abilityFunc["Song of Courage"] = function (self,target) {
	self.party.addEffect({name : "Song of Courage", stacks : true, trigger : "Permanent", turns : 10, stats : {atk : .08, matk : .08}})
}

abilityFunc["Song of Defense"] = function (self,target) { 
	self.party.addEffect({name : "Song of Defense", trigger : "DamageReceived", 
		dmgFunc : function (attack) {
			var c = .4
			self.sendAttack({atk : attack.atk * c, matk : attack.matk * c, dmg : attack.trueDamage * c, hitChance : 100, crit : 0, damageSource : "Song of Defense"})
			attack.physicalDamage = attack.physicalDamage * (1 - c)
			attack.magicDamage = attack.magicDamage * (1 - c)
			attack.trueDamage = attack.trueDamage * (1 - c)
			return attack
	}})
}

abilityFunc["Peaceful Respite"] = function (self,target) { 
	self.party.addEffect({name : "Peaceful Respite", turns : 1,
			stats : {atk : -.5, matk : -.5}})
	target.addEffect({name : "Peaceful Respite", turns : 1,
			stats : {atk : -.5, matk : -.5}})	
}

abilityFunc["Poem of Focus"] = function (self,target) {
	self.party.addEffect({name : "Poem of Focus", turns : 1, 
			stats : {critMod : 2.5}})
}

abilityFunc["Master Decoy"] = function (self,target) {
	self.addEffect({name : "Master Decoy Debuff", turns : 2, stats : {def : -.5, mdef : -.5}})
	self.addEffect({name : "Master Decoy DamageReceived", trigger : "DamageReceived",
			dmgFunc : function (attack) {
			self.party.receiveHeal(attack.totalDamage*.5)
			return attack
	}})
}

abilityFunc["Recharge"] = function (self,target) {

}

abilityFunc["Revive"] = function (self,target) {
	for (var  n=0; n < 3; n++ ){
		if ( self.party.frontRow[n] && self.party.frontRow[n].isDead ){
			self.party.frontRow[n].receiveHeal(.5, true)
			return true
		}
		if ( self.party.backRow[n] && self.party.backRow[n].isDead ){
			self.party.backRow[n].receiveHeal(.5, true)
			return true
		}
	}
}


//-- OTHER ---------------------------------

abilityFunc["Unbreakable"] = function (self,target) {
	self.removeAllEffects(true)
}

abilityFunc["Cleanse"] = function (self,target) {
	self.party.removeAllEffects(true)
}

abilityFunc["Silence"] = function (self,target) {
	target.removeAllEffects(false)
}

abilityFunc["Lesser Heal"] = function (self,target) {
	var frontID = (self.partyLocation+1) / 2

	if ( self.party.frontRow[frontID] && self.party.frontRow[frontID].questHP > 0 ){
		self.party.frontRow[frontID].receiveHeal(self.matk * .8)
	} else {
		self.receiveHeal(self.matk * .8)
	}
}

abilityFunc["Greater Heal"] = function (self,target) {
	self.party.receiveHeal(self.matk * .25)
}

abilityFunc["Mana Shield"] = function (self,target) {
	self.addEffect({name : "Mana Shield", trigger : "DamageReceived",
			dmgFunc : function (attack) {
			if ( attack.magicDamage <=0 ){
				return attack
			}
			self.sendAttack({matk : attack.matk * .6, hitChance : 100, damageSource : "Mana Shield"})
			attack.magicDamage = attack.magicDamage * .4
			return attack
	}})
}

abilityFunc["Mana Shield II"] = function (self,target) {
	self.addEffect({name : "Mana Shield II", trigger : "DamageReceived",
			dmgFunc : function (attack) {
			if ( attack.magicDamage <=0 ){
				return attack
			}
			self.sendAttack({matk : attack.matk * 1.2, hitChance : 100, damageSource : "Mana Shield II"})
			attack.magicDamage = 0
			return attack
	}})
}


//------------------------------------- ENEMY ABILITIES ---------------------------------------

abilityFunc["EnemyAttackAOE"] = function (self,target) {
	self.sendAttack({damageRatio : [1,0,1,0,1,0]})
}

abilityFunc["Streamline"] = function (self,target) {
	self.sendAttack({atk : self.atk * 1.2, matk : 0})
	self.addEffect({name : "Streamline", turns : 4, stats : {eva : .25}})
}

abilityFunc["Piercing strike"] = function (self,target) {
	self.sendAttack({atk : self.atk * 1.5, matk : 0})
	target.addEffect({name : "Piercing strike", turns : 3, stats : {def : -.3}})
}

abilityFunc["Tail Swipe"] = function (self,target) {
	self.sendAttack({damageRatio : [0,.8,0,.8,0,.8], atk : self.atk})
}

abilityFunc["Weaken"] = function (self,target) {
	self.sendAttack({atk : 0, matk : self.matk*1.2})
	target.addEffect({name : "Weaken", turns : 3, debuff : true, stats : {matk : -.25}})
}

abilityFunc["Charge"] = function (self,target) {
	self.sendAttack({atk : self.atk * 1.6, matk : 0})
}

abilityFunc["Cleave"] = function (self,target) {
	self.sendAttack({damageRatio : [0,1,0,1,0,1], atk : self.atk})
}

abilityFunc["Savage Charge"] = function (self,target) {
	self.sendAttack({damageRatio : [0,0,0,2.5,0,0], atk : self.atk})
}

abilityFunc["Iron Hide"] = function (self,target) {
	self.addEffect({name : "Iron Hide", turns : 4, stats : {atk : .5, def : .5}})
	self.addEffect({name : "Block", trigger : "OnDamage", stats : {atk : 0, matk : 0}})
}

abilityFunc["Shadow Dance"] = function (self,target) {
	self.addEffect({name : "Shadow Dance", turns : 4, stats : {atk : .25, eva : .5}})
}

abilityFunc["Swift Strike"] = function (self,target) {
	self.sendAttack({dmg : self.atk, atk : 0, matk : 0,})
}

abilityFunc["Harden"] = function (self,target) {
	self.addEffect({name : "Harden", turns : 4, stats : {def : .5, mdef : .5}})
	self.addEffect({name : "Block", trigger : "OnDamage", stats : {atk : 0, matk : 0}})
}

abilityFunc["Deadly Venom"] = function (self,target) {
	target.addEffect({name : "Deadly Venom", trigger : "DamageOnTurn",turns : 3, debuff : true,
		stats : {matk : self.matk*.7, atk : 0, crit : 0, hitChance : 100, attacker : self}
	}, [1,0,1,0,1,0])
}

abilityFunc["Unholy Cleave"] = function (self,target) {
	self.sendAttack({atk : self.atk*1.8})
	target.addEffect({name : "Unholy Cleave" , turns : 4, debuff : true, stats : {def : -.5}}, [0,1,0,1,0,1])
}

abilityFunc["Flame Breath"] = function (self,target) {
	self.sendAttack({damageRatio : [1,1,1,1,1,1]})
	target.addEffect({name : "Flame Breath" , turns : 4, debuff : true, stats : {def : -.25, mdef : -.25}}, [0,1,0,1,0,1])
}

abilityFunc["Dragon Scales"] = function (self,target) {
	self.addEffect({name : "Dragon Scales", turns : 4, stats : {atk : .5, mdef : .5}})
}

abilityFunc["Lava Whip"] = function (self,target) {
	self.sendAttack({atk : self.atk*2})
}

abilityFunc["Dark Power"] = function (self,target) {
	self.addEffect({name : "Dark Power", turns : 4, stats : {atk : .5, matk : .25}})
}

abilityFunc["Demon Slash"] = function (self,target) {
	self.sendAttack({atk : self.atk*1.8, matk : self.matk*1.2})
}

abilityFunc["Terrify II"] = function (self,target) {
	target.addEffect({name : "Terrify II", turns : 3, debuff : true, stats : {mdef : -.5}}, [1,1,1,1,1,1])
}

abilityFunc["Shadow Flame"] = function (self,target) {
	self.sendAttack({damageRatio : [.8,.8,.8,.8,.8,.8], matk : self.matk})
}

abilityFunc["Heat Wave"] = function (self,target) {
	target.addEffect({name : "Heat Wave", turns : 3, debuff : true, stats : {atk : -.25, mdef : -.5}}, [1,1,1,1,1,1])
}

abilityFunc["Phoenix Strike"] = function (self,target) {
	self.sendAttack({damageRatio : [.8,.8,.8,.8,.8,.8], matk : self.matk})
}

abilityFunc["Restore"] = function (self,target) {
	self.receiveHeal(self.matk * .5)
}

abilityFunc["Ferocious Bite"] = function (self,target) {
	self.sendAttack({damageRatio : [0,1,0,1,0,1], atk : self.atk*1 })
}

abilityFunc["Cerberus Claw"] = function (self,target) {
	self.sendAttack({atk : self.atk*1.4})
}

abilityFunc["Tail Swipe II"] = function (self,target) {
	self.sendAttack({damageRatio : [0,1.2,0,1.2,0,1.2], atk : self.atk})
}

abilityFunc["Hydro Slash"] = function (self,target) {
	self.sendAttack({atk : self.atk*1.2, matk : self.matk*1.2 })
}

abilityFunc["Inner Fire"] = function (self,target) {
	self.addEffect({name : "Inner Fire", turns : 4, stats : {atk : .5, matk : .5}})
}

abilityFunc["Fatal Gaze"] = function (self,target) {
	self.sendAttack({damageRatio : [0,0,0,2.5,0,0], matk : self.matk})
}

abilityFunc["Perish Song"] = function (self,target) {
	target.addEffect({name : "Perish Song", trigger : "DamageOnTurn", turns : 3, debuff : true,
		stats : {matk : self.matk*.7, atk : 0, crit : 0, hitChance : 100, attacker : self}
	}, [1,1,1,1,1,1])
}

abilityFunc["Earth Shield"] = function (self,target) {
	self.receiveHeal(self.def * 1, false, true)
}

abilityFunc["Earthquake"] = function (self,target) {
	self.sendAttack({damageRatio : [.8,.8,.8,.8,.8,.8], atk : self.atk})
}

abilityFunc["Aqua Shield"] = function (self,target) {
	self.receiveHeal(self.matk * .8, false, true)
}

abilityFunc["8 Arm Smash"] = function (self,target) {
	self.sendAttack({damageRatio : [.8,.8,.8,.8,.8,.8], matk : self.matk})
}

abilityFunc["Shadow Dance II"] = function (self,target) {
	self.addEffect({name : "Shadow Dance II", turns : 4, stats : {atk : .5,eva : .5}})
}

abilityFunc["Shadow Strike"] = function (self,target) {
	self.sendAttack({damageRatio : [0,0,0,2.5,0,0], matk : self.matk})
}

abilityFunc["Snap"] = function (self,target) {
	self.sendAttack({atk : self.atk*1.8})
}

abilityFunc["Charge II"] = function (self,target) {
	self.sendAttack({atk : self.atk * 2, matk : 0})
}

abilityFunc["Stomp"] = function (self,target) {
	self.sendAttack({damageRatio : [.7,.7,.7,.7,.7,.7], atk : self.atk})
}

abilityFunc["Skorge Slash"] = function (self,target) {
	self.sendAttack({atk : self.atk*2.5, matk : self.matk*2.5})
}

abilityFunc["Fire Shield"] = function (self,target) {
	self.receiveHeal(self.matk * 5, false, true)
}

abilityFunc["Dragon Lash"] = function (self,target) {
	self.sendAttack({damageRatio : [0,3,0,3,0,3], atk : self.atk})
}

abilityFunc["Dragon Breath"] = function (self,target) {
	self.sendAttack({damageRatio : [.5,.5,.5,.5,.5,.5], atk : self.atk, matk : self.matk})
}

abilityFunc["Pyroblast"] = function (self,target) {
	self.sendAttack({damageRatio : [0,0,0,3,0,0], matk : self.matk})
}

abilityFunc["Hellfire"] = function (self,target) {
	self.sendAttack({damageRatio : [.5,.5,.5,.5,.5,.5], matk : self.matk})
}

abilityFunc["Fire Shield II"] = function (self,target) {
	self.receiveHeal(self.matk * 3, false, true)
}

abilityFunc["Ground Slam"] = function (self,target) {
	self.sendAttack({damageRatio : [.5,.5,.5,.5,.5,.5], matk : self.def})
}

abilityFunc["Dark Flame"] = function (self,target) {
	self.sendAttack({damageRatio : [.5,.5,.5,.5,.5,.5], dmg : self.matk})
	target.addEffect({name : "Dark Flame", turns : 3, debuff : true, stats : {def : -.5}}, [1,1,1,1,1,1])
}

abilityFunc["Devour"] = function (self,target) {
	self.sendAttack({damageRatio : [0,0,0,5,0,0], atk : self.atk})
}

/*
    ____  _
   / __ )(_)________  ____
  / __  / / ___/ __ \/ __ \
 / /_/ / (__  ) /_/ / / / /
/_____/_/____/\____/_/ /_/
--*/

abilityFunc["Colossal Stomp"] = function (self,target) {
	self.sendAttack({atk : self.atk * 3, matk : 0})
}

abilityFunc["Earthquake II"] = function (self,target) {
	self.sendAttack({damageRatio : [1,1,1,1,1,1], atk : self.atk})
}

abilityFunc["Battering Ram"] = function (self,target) {
	self.sendAttack({atk : self.atk * 1.5, matk : 0})
	self.addEffect({name : "Battering Ram", turns : 3, stats : {def : .5}})
}

/*
 _       __      ______
| |     / /___  / / __/
| | /| / / __ \/ / /_
| |/ |/ / /_/ / / __/
|__/|__/\____/_/_/
--*/

abilityFunc["Desolate Howl"] = function (self,target) {
	self.addEffect({name : "Desolate Howl", turns : 3, stats : {atk : .5,eva : .5}})
}

abilityFunc["Savage Bite"] = function (self,target) {
	self.sendAttack({atk : self.atk * 3, matk : 0})
}

/*
 _       __           _ __  __
| |     / /________ _(_) /_/ /_
| | /| / / ___/ __ `/ / __/ __ \
| |/ |/ / /  / /_/ / / /_/ / / /
|__/|__/_/   \__,_/_/\__/_/ /_/
--*/

abilityFunc["Terror"] = function (self,target) {
	target.addEffect({name : "Terror", turns : 5, stats : {mdef : -.5}}, [1,1,1,1,1,1])
}

abilityFunc["Nightmare"] = function (self,target) {
	self.sendAttack({damageRatio : [1,1,1,1,1,1], matk : self.matk * 1.5})
}

abilityFunc["Corruption"] = function (self,target) {
	target.addEffect({name : "Corruption", trigger : "DamageOnTurn", turns : 3, debuff : true,
		stats : {matk : self.matk*1, atk : 0, crit : 0, hitChance : 100, attacker : self}
	}, [1,1,1,1,1,1])
}

/*
   _______
  / ____(_)___ _____ ______
 / / __/ / __ `/ __ `/ ___/
/ /_/ / / /_/ / /_/ (__  )
\____/_/\__, /\__,_/____/
       /____/
--*/

abilityFunc["Titanic Slam"] = function (self,target) {
	self.sendAttack({atk : self.atk * 3, matk : 0})
}


abilityFunc["Bulwark"] = function (self,target) {
	self.addEffect({name : "Bulwark", turns : 3, stats : {atk : .5,eva : .5}})
}

abilityFunc["Undertow"] = function (self,target) {
	self.sendAttack({damageRatio : [1,1,1,1,1,1], atk : self.def * 1})
}

/*
  ______
 /_  __/___  _______  ______
  / / / __ \/ ___/ / / / __ \
 / / / /_/ / /  / /_/ / / / /
/_/  \____/_/   \__,_/_/ /_/

--*/

abilityFunc["Rampart"] = function (self,target) { // Stacking should work, uncertain on % power
	self.addEffect({name : "Rampart", stacks : true, trigger : "Permanent", stats : {def : .25, mdef : .25}})
}

abilityFunc["Earthquake III"] = function (self,target) {
	self.sendAttack({damageRatio : [2,2,2,2,2,2], atk : self.atk})
}

abilityFunc["Unstoppable Force"] = function (self,target) {
	self.sendAttack({damageRatio : [0,3,0,3,0,3], atk : self.atk})
}


/*
    ______                _
   / ____/__  ____  _____(_)____
  / /_  / _ \/ __ \/ ___/ / ___/
 / __/ /  __/ / / / /  / / /
/_/    \___/_/ /_/_/  /_/_/

--*/
abilityFunc["Arctic Fury"] = function (self,target) { 
	self.addEffect({name : "Arctic Fury", stacks : true, trigger : "Permanent", stats : {atk : .5}})
}


abilityFunc["Malice"] = function (self,target) {
	self.sendAttack({atk : self.atk * 4, matk : 0})
}

abilityFunc["Elusion"] = function (self,target) {
	self.addEffect({name : "Elusion", trigger : "OnDamage", turns : 3, dmgFunc : function (attack) {
		attack.hitChance = 50
		return attack
	}})	
}

/*
    ________
   / ____/ /____  _________  __  _______
  / __/ / __/ _ \/ ___/ __ \/ / / / ___/
 / /___/ /_/  __/ /  / / / / /_/ (__  )
/_____/\__/\___/_/  /_/ /_/\__,_/____/

--*/

abilityFunc["Anti Magic Shell"] = function (self,target) { // Might still let some dmg through?
	self.addEffect({name : "Anti Magic Shell", turns : 3, stats : {mdef : 100}})
}

abilityFunc["Malific Vision"] = function (self,target) {
	self.sendAttack({atk : 0, matk : self.matk *4})
}

abilityFunc["Death Touch"] = function (self,target) {
	self.sendAttack({damageRatio : [0,0,5,0,0,0], matk : self.matk})
}

abilityFunc["Ice Barrier"] = function (self,target) {
	self.receiveHeal(self.matk * 1.5, false, true)
}

/*
    ____
   / __ )____  _________  _____
  / __  / __ \/ ___/ __ \/ ___/
 / /_/ / /_/ / /  / /_/ (__  )
/_____/\____/_/   \____/____/

--*/

abilityFunc["Obsidian Shield"] = function (self,target) {// Might still let some dmg through?
	self.addEffect({name : "Obsidian Shield", turns : 3, stats : {def : 100}}) 
}

abilityFunc["Undertow II"] = function (self,target) {
	self.sendAttack({damageRatio : [1,0,1,0,1,0], atk : self.atk})
}

abilityFunc["Reflect"] = function (self,target) {
	self.addEffect({name : "Reflect",trigger : "DamageReceived", turns : 1, dmgFunc : function (attack) {
		var reflectAmount = .5
		if ( attack.magicDamage <=0 ){ 
			return attack
		}
		self.sendAttack({matk : attack.matk * reflectAmount, damageSource : "Reflect"})
		attack.matk = attack.matk * (1-reflectAmount)
		return attack
	}})
}

abilityFunc["Demolish"] = function (self,target) {
	self.sendAttack({atk : self.atk*4, matk : 0})
}

/*
    __ __           __  __
   / //_/___ ______/ /_/ /_  ____ ______
  / ,< / __ `/ ___/ __/ __ \/ __ `/ ___/
 / /| / /_/ / /  / /_/ / / / /_/ (__  )
/_/ |_\__,_/_/   \__/_/ /_/\__,_/____/

--*/

abilityFunc["Absorb"] = function (self,target) { // Pretty sure this will work
	self.addEffect({name : "Absorb", turns : 3, trigger : "OnDamage", 
			dmgFunc : function (attack) {
		var absorbAmount = .5

		self.receiveHeal(attack.matk * absorbAmount)
		attack.matk = attack.matk * (1-absorbAmount)
		return attack
	}})
}

abilityFunc["Requiem"] = function (self,target) {
	target.addEffect({name : "Requiem", trigger : "DamageOnTurn", turns : 5, debuff : true,
		stats : {matk : self.matk*.5, atk : 0, crit : 0, hitChance : 100, attacker : self}
	}, [1,1,1,1,1,1])
}

abilityFunc["Defile"] = function (self,target) {
	self.sendAttack({damageRatio : [1,1,1,1,1,1], matk : self.matk})
}

abilityFunc["Siphon Soul"] = function (self,target) { // AOE Drain
	var result = self.sendAttack({damageRatio : [1,1,1,1,1,1], matk : self.matk * .5})
	if ( result ){ 
		for (var  n=0; n < result.lenght; n ++ ){ 
			if ( result[n].matk ){ 
				self.receiveHeal(result[n].matk)
			}
		}
		
	}
}

/*
    ____        __
   / __ )____ _/ /___  _____
  / __  / __ `/ / __ \/ ___/
 / /_/ / /_/ / / /_/ / /
/_____/\__,_/_/\____/_/

--*/

abilityFunc["Pulverize"] = function (self,target) {
	self.sendAttack({atk : self.atk*3, matk : 0})
}

abilityFunc["Cataclysm"] = function (self,target) {
	self.sendAttack({damageRatio : [2,2,2,2,2,2], atk : self.atk})
}

abilityFunc["Unbreakable Will"] = function (self,target) { // These don't target the specific attacker as of now
	self.addEffect({name : "Unbreakable Will", turns : 3, trigger : "OnDamage", 
			dmgFunc : function (attack) {
		var reflectAmount = .75

		self.sendAttack({atk : attack.atk * reflectAmount, matk : 0, acc : 9999, damageSource : "Unbreakable Will"})
		attack.atk = attack.atk * (1-reflectAmount)
		return attack
	}})
}

abilityFunc["Oblivion Shield"] = function (self,target) {
	self.receiveHeal(self.atk * 1, false, true)
}

/*
    ___
   /   |____  __  ___________  _____
  / /| /_  / / / / / ___/ __ \/ ___/
 / ___ |/ /_/ /_/ / /  / /_/ (__  )
/_/  |_/___/\__,_/_/   \____/____/

--*/
abilityFunc["Glacial Prism"] = function (self,target) { // These don't target the specific attacker as of now
	self.addEffect({name : "Glacial Prism", turns : 3, trigger : "OnDamage", 
			dmgFunc : function (attack) {
		var reflectAmount = .5

		self.sendAttack({atk : attack.atk * reflectAmount, matk : attack.matk * reflectAmount, acc : 9999, damageSource : "Glacial Prism"})
		attack.atk = attack.atk * (1-reflectAmount)
		attack.matk = attack.matk * (1-reflectAmount)
		return attack
	}})
}

abilityFunc["Winters Bite"] = function (self,target) {
	self.sendAttack({damageRatio : [1,1,1,1,1,1], matk : self.matk})
}

abilityFunc["Devouring Cold"] = function (self,target) { // Pretty sure this will work
	self.addEffect({name : "Devouring Cold", turns : 3, trigger : "OnDamage", 
			dmgFunc : function (attack) {
		var absorbAmount = .5

		self.receiveHeal((attack.atk + attack.matk) * absorbAmount)
		attack.atk = attack.atk * (1-absorbAmount)
		attack.matk = attack.matk * (1-absorbAmount)
		return attack
	}})
}

abilityFunc["Oblivion"] = function (self,target) {
	self.sendAttack({atk : self.atk*2, matk : self.matk*2})
}


//------------------------------------- EXPANSION ABILITIES ---------------------------------------

abilityFunc["Swap Attack"] = function (self,target) { // Should function, unsure if the numbers will be accurate. 
	self.addEffect({name : "Swap Attack",  reversible : true, statFunc : function (hero) {
		var atk = hero.atk
		hero.atk = hero.matk 
		hero.matk = atk
	}})
}

abilityFunc["Swap Defense"] = function (self,target) { // Should function, unsure if the numbers will be accurate. 
	self.addEffect({name : "Swap Defense",  reversible : true, statFunc : function (hero) {
		var def = hero.def
		hero.def = hero.mdef 
		hero.mdef = def
	}})
}

abilityFunc["Double Image"] = function (self,target) { // Needs implementation
	target.addEffect({name : "Double Image", trigger : "OnAttack", turns : 1, 
			dmgFunc : function (attack) {
				if ( Math.random() * 100 < 50 ){
					return false
				}
			return attack
	}})
}

abilityFunc["Atk Immune"] = function (self,target) {
	self.addEffect({name : "Atk Immune", trigger : "DamageReceived",
			stats : {physicalDamage : 0}}) 
}

abilityFunc["Matk Immune"] = function (self,target) {
	self.addEffect({name : "Matk Immune", trigger : "DamageReceived",
			stats : {magicalDamage : 0}}) 
}

abilityFunc["Def Growth"] = function (self,target) { // Stacking should work, uncertain on % power
	self.addEffect({name : "Def Growth", stacks : true, trigger : "Permanent", stats : {def : .1}})
}

abilityFunc["Mdef Growth"] = function (self,target) { // Stacking should work, uncertain on % power
	self.addEffect({name : "Mdef Growth", stacks : true, trigger : "Permanent", stats : {mdef : .1}})
}

abilityFunc["Atk Growth"] = function (self,target) { // Stacking should work, uncertain on % power
	self.addEffect({name : "Atk Growth", stacks : true, trigger : "Permanent", stats : {atk : .1}})
}

abilityFunc["Matk Growth"] = function (self,target) { // Stacking should work, uncertain on % power
	self.addEffect({name : "Matk Growth", stacks : true, trigger : "Permanent", stats : {matk : .1}})
}

abilityFunc["Explode"] = function (self,target) { // Uncertain if receive attack works in this manner
	self.sendAttack({damageRatio : [1,1,1,1,1,1], matk : self.matk})
	var attackParams = {attacker : self, atk : 0, matk : self.matk, acc : self.acc, crit : self.crit, critMod : self.critMod}
	self.receiveAttack(attackParams)
}

abilityFunc["Atk Drain"] = function (self,target) { // Pretty positive these work. Result might return weird if its a miss
	var result = self.sendAttack({atk : self.atk * .5})
	if ( result.atk ){ 
		self.receiveHeal(result.atk)
	}
}

abilityFunc["Atk Drain II"] = function (self,target) {
	var result = self.sendAttack({atk : self.atk * .8})
	if ( result.atk ){
		self.receiveHeal(result.atk)
	}
}

abilityFunc["Matk Drain"] = function (self,target) {
	var result = self.sendAttack({matk : self.matk * .5})
	if ( result.matk ){
		self.receiveHeal(result.matk)
	}
}

abilityFunc["Matk Drain II"] = function (self,target) {
	var result = self.sendAttack({matk : self.matk * .8})
	if ( result.matk ){ 
		self.receiveHeal(result.matk)
	}
}

abilityFunc["Vampire Blast"] = function (self,target) { // AOE Drain
	var result = self.sendAttack({damageRatio : [1,1,1,1,1,1], matk : self.matk * .5})
	if ( result ){ 
		for (var  n=1; n < result.lenght; n++ ){ 
			if ( result[n].matk ){ 
				self.receiveHeal(result[n].matk)
			}
		}
		
	}
}

abilityFunc["Absorb Atk"] = function (self,target) { // Pretty sure this will work
	self.addEffect({name : "Absorb Atk", turns : 1, trigger : "OnDamage", 
			dmgFunc : function (attack) {
		var absorbAmount = .75

		self.receiveHeal(attack.atk * absorbAmount)
		attack.atk = attack.atk * (1-absorbAmount)
		return attack
	}})
}

abilityFunc["Absorb Matk"] = function (self,target) { // Pretty sure this will work
	self.addEffect({name : "Absorb Matk", turns : 1, trigger : "OnDamage", 
			dmgFunc : function (attack) {
		var absorbAmount = .75

		self.receiveHeal(attack.matk * absorbAmount)
		attack.matk = attack.matk * (1-absorbAmount)
		return attack
	}})
}

abilityFunc["Absorb All"] = function (self,target) { // Pretty sure this will work
	self.addEffect({name : "Absorb All", turns : 1, trigger : "OnDamage", 
			dmgFunc : function (attack) {
		var absorbAmount = .5

		self.receiveHeal((attack.atk + attack.matk) * absorbAmount)
		attack.atk = attack.atk * (1-absorbAmount)
		attack.matk = attack.matk * (1-absorbAmount)
		return attack
	}})
}

abilityFunc["Reflect Atk"] = function (self,target) { // These don't target the specific attacker as of now
	self.addEffect({name : "Reflect Atk", turns : 1, trigger : "OnDamage", 
			dmgFunc : function (attack) {
		var reflectAmount = .8

		self.sendAttack({atk : attack.atk * reflectAmount, matk : 0, acc : 9999})
		attack.atk = attack.atk * (1-reflectAmount)
		return attack
	}})
}

abilityFunc["Reflect Matk"] = function (self,target) { // These don't target the specific attacker as of now
	self.addEffect({name : "Reflect Matk", turns : 1, trigger : "OnDamage",
			dmgFunc : function (attack) {
		var reflectAmount = .8

		self.sendAttack({matk : attack.matk * reflectAmount, atk : 0, acc : 9999})
		attack.matk = attack.matk * (1-reflectAmount)
		return attack
	}})
}

abilityFunc["Reflect All"] = function (self,target) {  // These don't target the specific attacker as of now
	function reflect(attack) {
		var reflectAmount = .5

		self.sendAttack({atk : attack.atk * reflectAmount, matk : attack.matk * reflectAmount,
				acc : 9999})
		attack.atk = attack.atk * (1-reflectAmount)
		attack.matk = attack.matk * (1-reflectAmount)
		return attack
	}
	self.addEffect({name : "Reflect All", turns : 1, trigger : "OnDamage", dmgFunc : reflect})

}

abilityFunc["Confuse"] = function (self,target) { // This is the hardest one to do, will revisit later

}

abilityFunc["Obliterate"] = function (self,target) { // This should work, but might target empty/dead slot
	var randomKill = math.random(1,6)
	var dmg = [0,0,0,0,0,0]
	dmg[randomKill] = 1
	self.sendAttack({damageRatio : dmg, trueDmg : 2000, acc : 9999})

}

module.exports = {
    abilities: abilityFunc,
    passiveData: passiveData
}