import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SERVER_API_URL,SERVER_PATH_URL } from 'src/app/app.constants';

import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';
import { HrmsDepartemenService } from 'src/app/shared/services/hrms_depatemen.service';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';

declare var swal: any;

export class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'list-cmp',
  templateUrl: 'list.component.html'
})

export class ListComponent implements OnInit {
  // dtOptions: DataTables.Settings = {};
  dtOptions: any;
  persons: any[];
  private apiUrl = SERVER_API_URL;
  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  exportAsConfig: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'mytable',
  };
  selectedMenu:any[];
  dropdownEnabled = true;
  menuData: TreeviewItem[];
  values: number[];
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,

    maxHeight: 400
  });

  buttonClasses = [
    'btn-outline-primary',
    'btn-outline-secondary',
    'btn-outline-success',
    'btn-outline-danger',
    'btn-outline-warning',
    'btn-outline-info',
    'btn-outline-light',
    'btn-outline-dark'
  ];
  buttonClass = this.buttonClasses[0];
  departemen = [];
  //public dataTable: DataTable;

  bsModalRef: BsModalRef;
  dbName;
  pathName;
  PATH_URL;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private departemenService: HrmsDepartemenService,
    private router: Router,) {
      this.dbName= this.authenticationService.getUserDB();
      this.pathName= this.authenticationService.getUserPath();
      this.PATH_URL=SERVER_PATH_URL;

  }
  getRouterLink(link){
    return ['/'+link]

  }

  getSelected(data:any){

    data.forEach(element => {
     element['selected']=true;
      if (element['children']){
        this.getSelected(element['children']);

      }

    });

  }
  ngOnInit() {
    this.authenticationService.getMenu().subscribe(d => {
      this.menuData = d['data'];
      console.log(this.menuData);
      this.selectedMenu=[];
      this.menuData.forEach(element => {
        element['selected']=true;
        // console.log(element['id']);
        // let m={menu_id:element['id'],selected:true};
        // this.selectedMenu.push(m);
        // this.selectedMenu[element['id']]['selected']=1;
        this.getSelected(element['children']);

      });
     //this.menuData =new BookService().getBooks();

      // console.log(this.selectedMenu);
    //   setTimeout(() => {




    //  }, 10);
    });
    //this.loadDatatable();
  }
changeSelected(){
  console.log(this.menuData);
}
  onFilterChange(value: string): void {
    console.log('filter:', value);
  }
  loadDatatable() {

    let that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      //responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Cari",


      },
      // order: [1, 'asc'],
      // dom: '<"html5buttons"B>ltfrtip',
      columns: [
        {
          'data': 'id',
          //'sortable': false,
          'visible': false,
           'width': "10%",
          //'target': [0]
        },

        {
          'data': 'nama',
          'width': "20%",
          // 'target': [0]
        }
      ],
      // buttons: [
      //   {
      //     extend: 'csv',
      //     title: "csv",
      //     className: "btn btn-datatable-gredient",
      //     action: function (e, dt, node, config) {
      //       that.exportFiles('csv')
      //     }
      //   }, {
      //     extend: 'excel',
      //     title:"excel",
      //     className: "btn btn-datatable-gredient",
      //     action: function (e, dt, node, config) {
      //       that.exportFiles('xlsx')
      //     }
      //   }, {
      //     extend: 'pdf',
      //     title: "pdf",
      //     className: "btn btn-datatable-gredient",
      //     action: function (e, dt, node, config) {
      //       that.exportFiles('pdf')
      //     }
      //   }
      // ],
      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(this.apiUrl + '/hrmsDepartemen/list', dataTablesParameters, {})
          .subscribe(resp => {
            this.departemen = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      }
    };
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  getTipe(tipe){
    let nama=""
    if (tipe=="0"){
      nama="Kas";

    }else if (tipe=="1"){
      nama="Bank";

    }else if (tipe=="2"){
      nama="Piutang";

    }else if (tipe=="3"){
      nama="Hutang";

    }else if (tipe=="4"){
      nama="Modal";

    }else if (tipe=="5"){
      nama="Biaya";

    }else if (tipe=="6"){
      nama="Pendapatan";

    }
return nama;
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload(null, false);
      setTimeout(() => {
        //this.dtTrigger.next();

        if (this.departemen.length > 0) {
          $('.tfoot_dt').addClass('d-none');
        } else {
          $('.tfoot_dt').removeClass('d-none');
        }
      });
    });
  }

  exportFiles(type) {
    this.exportAsConfig.type = type;
    this.exportAsService.save(this.exportAsConfig, 'departemen').subscribe(() => { });
  }
  add() {
    let modalConfig = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true,
      //size: 'lg',
     // class: "modal-lg ",

    };
    // this.bsModalRef = this.bsModalService.show(AddComponent,modalConfig);
    // this.bsModalRef.content.event.subscribe(result => {
    //   if (result == 'OK') {
    //     // let t= $('#datatables').DataTable().ajax.reload();
    //     // t.draw();
    //     this.rerender();
    //   }
    // });
  }

  delete(id: number) {
    let that = this;
    swal({
      title: 'Yakin akan menghapus?',
      text: "Data akan dihapus dari database!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Ya, hapus data!',
      cancelButtonText: 'Batal',

      buttonsStyling: false
    }).then(function () {
      that.departemenService.delete(id).subscribe(data => {
        // let t = $('#datatables').DataTable().ajax.reload();
        // t.draw();
        that.rerender();

      });

      // swal({
      //   title: 'Deleted!',
      //   text: 'Your file has been deleted.',
      //   type: 'success',
      //   confirmButtonClass: "btn btn-success",
      //   buttonsStyling: false
      //   })
    });

  }

  edit(id: number) {
    let that = this;
    let departemen;
    this.departemenService.getById(id).subscribe(data => {
      departemen = data['data'];

      let modalConfig = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        //size: 'lg',
        //class: "modal-lg ",
        initialState: {
          departemen: departemen
        }
      };
      // this.bsModalRef = this.bsModalService.show(EditComponent, modalConfig);
      // this.bsModalRef.content.event.subscribe(data => {

      //   // let t = $('#datatables').DataTable().ajax.reload();
      //   // t.draw();
      //   that.rerender();
      // });


    }, error => {

    });

  }
  detail(id: number) {
    this.router.navigate(['departemen/detail', id.toString(),{previousUrl: this.router.url}]);

  }
}

export class BookService {
  getBooks(): TreeviewItem[] {
    const childrenCategory = new TreeviewItem({
      text: 'Children', value: 1, collapsed: true, children: [
        { text: 'Baby 3-5', value: 11 },
        { text: 'Baby 6-8', value: 12 },
        { text: 'Baby 9-12', value: 13 }
      ]
    });
    const itCategory = new TreeviewItem({
      text: 'IT', value: 9, children: [
        {
          text: 'Programming', value: 91, children: [{
            text: 'Frontend', value: 911, children: [
              { text: 'Angular 1', value: 9111 },
              { text: 'Angular 2', value: 9112 },
              { text: 'ReactJS', value: 9113, disabled: true }
            ]
          }, {
            text: 'Backend', value: 912, children: [
              { text: 'C#', value: 9121 },
              { text: 'Java', value: 9122 },
              { text: 'Python', value: 9123, checked: false, disabled: true }
            ]
          }]
        },
        {
          text: 'Networking', value: 92, children: [
            { text: 'Internet', value: 921 },
            { text: 'Security', value: 922 }
          ]
        }
      ]
    });
    const teenCategory = new TreeviewItem({
      text: 'Teen', value: 2, collapsed: true, disabled: true, children: [
        { text: 'Adventure', value: 21 },
        { text: 'Science', value: 22 }
      ]
    });
    const othersCategory = new TreeviewItem({ text: 'Others', value: 3, checked: false, disabled: true });
    return [childrenCategory, itCategory, teenCategory, othersCategory];
  }
}
