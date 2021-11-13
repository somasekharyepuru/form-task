import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user.model';
import { UserRegistrationComponent } from 'src/app/modules/user-registration/user-registration.component';
import { DataService } from 'src/app/services/data.service';
import { DatabaseService } from 'src/app/services/database.service';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { UserTable, UserTableConfig } from './table.config';

@Component({
  selector: 'ms-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  userTableConfig: UserTable[] = JSON.parse(JSON.stringify(UserTableConfig));
  userListConfig: {
    fetched: Boolean,
    data:  User[]
  } = {
    fetched: false,
    data: []
  };
  rawMasterData: User[] = [];
  constructor(
    private dataBaseService: DatabaseService,
    private dataService: DataService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getUserList();
  }

  private getUserList(): void {
    this.dataBaseService.getUsers().subscribe ( data => {
      this.rawMasterData = data;
      this.userListConfig.data = this.dataService.flattenObject(data);
      this.userListConfig.fetched = true;
    }, error => {
      this.userListConfig.data = [];
      this.userListConfig.fetched = true;
    })
  }

  public editUser(user: User): void {
    const modalRef = this.modalService.open( UserRegistrationComponent);
    const userData = this.rawMasterData.find( listUser => listUser.email === user.email)
    modalRef.componentInstance.formData = userData;
    modalRef.result.then( value => {
      this.getUserList();
      this.toastr.success('Updated Successfully');
    })
  }

  public deleteUser(user: User): void {
    const modalRef = this.modalService.open( DeleteModalComponent).result.then( value => {
      if (value === 'delete') {
        this.dataBaseService.deleteUser(user.email).subscribe( data => {
          console.log('Deleted successfully');
          this.getUserList();
          this.toastr.warning('Deleted successfully');

        }, error => {
          console.log("Deletion failed")
        })
      }
    })

  }

  /**
   * get user List
   * update user
   * delete user
   */

}
