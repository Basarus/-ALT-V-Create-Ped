/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import alt from 'alt-client';
import * as native from 'natives';

let player = alt.Player.local;
export let data_ped = [];

alt.onServer('client::ped:create', (data) => {
    new createNpc(data.type, data.model, data.coords, data.heading, data.event, data.name)
})

export default class createNpc{
    constructor(
        type = 0, // Тип персонажа, см. https://natives.altv.mp/#/0xD49F9B0955C367DE;
        model, // Модель персонажа, см. https://wiki.rage.mp/index.php?title=Peds;
        coords, // Позиция;
        heading, // Поворот головы (куда смотрит);
        event, // Ключ;
        name, // Имя;
    )
    {
        native.requestModel(alt.hash(model)); // Подгружаем модель;
        this.ped = native.createPed(type, alt.hash(model), coords.x, coords.y, coords.z - 1, heading, false, false); // Создаем NPC;
        native.setBlockingOfNonTemporaryEvents(this.ped, true);
        native.taskSetBlockingOfNonTemporaryEvents(this.ped, true);
        native.setEntityInvincible(this.ped, true);
        native.setPedFleeAttributes(this.ped, 15, true);
        native.freezeEntityPosition(this.ped, true);


        let data = { // Создаем форму базы данных NPC;
        ped: this.ped,
        name: name,
        event: event,
        pos: coords
        };

        data_ped.push(data); // Отправляем в базу нового NPC;

        alt.log(`NPC ${name} успешно создан!`)
    }
} 


alt.on('keyup', (key) => {
    if (key == 69){
        data_ped.map(value => {
            let dist = native.getDistanceBetweenCoords(value.pos.x, value.pos.y, value.pos.z, player.pos.x, player.pos.y, player.pos.z);
            if (dist <= 2){
                alt.log(`Меня зовут ${value.name} и я делаю ${value.event}`)
            }
        })
    }
})


alt.on('disconnect', () => {
    data_ped.map(value => {
        native.deletePed(value.ped)
    });
    
    data_ped = [];
})

// test command = /createNpc 1 a_f_m_fatwhite_01 test test