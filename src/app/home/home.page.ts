import { Component } from '@angular/core';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tasks : any[] = [];
  constructor(
    private alertctrl: AlertController,
    private toastctrl: ToastController,
    private actionsheetctrl: ActionSheetController
  ) {
    let taskJson = localStorage.getItem('taskDB');

    if(taskJson!=null){
      this.tasks = JSON.parse(taskJson)
    }
  }

  async showAdd(){
    const alert = await this.alertctrl.create({
      header: 'o que deseja fazer?',
      inputs: [
        {
          name: 'newTask',
          type: 'text',
          placeholder: 'o que deseja fazer?'
        }
      ],
      buttons: [
        {
          text:'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('clicked cancel');
          }
        },
        {
          text: 'Adicionar',
          handler: (form) => {
            this.add(form.newTask);
          }
        },
      ]
    });
    await alert.present();
  }

  // VALIDA SE USUARIO PREENCHEU A TASK
  async add(newTask : string){
    if(newTask.trim().length < 1){
      const toast = await this.toastctrl.create({
        message : 'Informe o que deseja fazer!',
        duration: 2000,
        position: 'top'
      });
      toast.present();
      return;
    }
    let task = {name: newTask, done: false}

    this.tasks.push(task);

    this.updateLocalStorage();
  }

  updateLocalStorage(){
    localStorage.setItem('taskDB', JSON.stringify(this.tasks));
  }

 async openActions(task: any){
    const actionSheet =  await this.actionsheetctrl.create({
      header: 'O que deseja Fazer?',
      buttons: [{
        text: task.done ? 'Desmarcar' : 'Marcar',
        icon: task.done ? 'radio-button-off' : 'checkmark-circle',
        handler: () => {
          task.done = !task.done;

          this.updateLocalStorage();
        }
      },
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked')
        }
      }]
    });
    await actionSheet.present();
  }

  delete(task : any){
    this.tasks = this.tasks.filter(taskArray => task != taskArray);

    this.updateLocalStorage();
  }

}
