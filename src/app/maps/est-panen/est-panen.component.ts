import { Component, OnInit } from '@angular/core';
import { latLng, tileLayer } from 'leaflet';
declare var $: any;
import * as Leaflet from 'leaflet';
import "leaflet-control-geocoder";
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import { formatDate } from '@angular/common';
import { EstBkmPanenService } from 'src/app/shared/services/est_bkm_panen.service';
import { ViewPanenComponent } from './view/view-panen.component';
import * as L from 'leaflet';
// Leaflet.Icon.Default.imagePath = 'assets/leaflet/';
Leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  iconUrl: 'assets/leaflet/marker-icon.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png'
});
@Component({
  moduleId: module.id,
  selector: 'panen-maps-cmp',
  templateUrl: './est-panen.component.html',
  styleUrls: ['./est-panen.component.css']
})

export class EstPanenMapComponent implements OnInit {
  bsModalRef: BsModalRef;
  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&amp;copy; OpenStreetMap contributors'
      })
    ],
    zoom: 7,
    center: latLng([-6.2121582279795815, 106.7547734184832])
  };
  dbName: string;
  pathName: string;
  PATH_URL: any;
  parameterForm: any;
  panen: any;
  initMarkers() {
    const initialMarkers = [
      {
        position: { lat: 28.625485, lng: 79.821091 },
        draggable: true
      },
      {
        position: { lat: 28.625293, lng: 79.817926 },
        draggable: true
      },
      {
        position: { lat: 28.625182, lng: 79.81464 },
        draggable: true
      }
    ];
    for (let index = 0; index < initialMarkers.length; index++) {
      const data = initialMarkers[index];
      const marker = this.generateMarker(data, index);
      marker.addTo(this.map).bindPopup(`<b>${data.position.lat},  ${data.position.lng}</b>`);
      this.map.panTo(data.position);
      this.markers.push(marker)
    }
  }

  generateMarker(data: any, index: number) {
    var mIcon = new L.Icon({
      iconUrl: data['iconUrl'],
      shadowUrl: data['iconShadowUrl'],
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // L.marker([51.5, -0.09], {icon: greenIcon}).addTo(map);
    return Leaflet.marker(data.position, {icon: mIcon, draggable: data.draggable })
      .on('click', (event) => this.markerClicked(event, index))
      .on('dragend', (event) => this.markerDragEnd(event, index));
  }

  onMapReady($event: Leaflet.Map) {
    this.map = $event;
    // this.initMarkers();
  }

  async mapClicked($event: any) {

    console.log($event.latlng.lat, $event.latlng.lng);
    const address = await this.getAddress($event.latlng.lat, $event.latlng.lng);
    console.log(address)
  }

  markerClicked($event: any, index: number) {
    console.log(index);
    console.log($event.latlng.lat, $event.latlng.lng);
    console.log(this.panen[index]);
    this.view(index);

  }

  markerDragEnd($event: any, index: number) {
    console.log($event.target.getLatLng());
  }
  getAddress(lat: number, lng: number) {
    const geocoder = (Leaflet.Control as any).Geocoder.nominatim();
    return new Promise((resolve, reject) => {
      geocoder.reverse(
        { lat, lng },
        this.map.getZoom(),
        (results: any) => results.length ? resolve(results[0].name) : reject(null)
      );
    })
  }
  exportAsConfig: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'mytable',
  };

  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private router: Router,
    private builder: FormBuilder, private EstBkmPanenService: EstBkmPanenService
  ) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;
    let toDate: Date = new Date();
    let startdate = new Date(toDate.getFullYear(), 0, 1)// 1 Januari tahun sekarang
    this.parameterForm = this.builder.group({
      lokasi: new FormControl([]),
      // tanggal_mulai: new FormControl(new Date(2022, 0, 1), Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),

      tanggal_akhir: new FormControl(toDate, Validators.required),

    });

  }
  ngOnInit() {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;


  }
   showData() {


  //   let tanggal1 = formatDate(this.parameterForm.get('tanggal_mulai').value, "yyyy-MM-dd", 'en_US');
  //   let tanggal2 = formatDate(this.parameterForm.get('tanggal_akhir').value, "yyyy-MM-dd", 'en_US');
  //   this.EstBkmPanenService.getPanenMapByTanggal(tanggal1, tanggal2).subscribe(
  //     d => {
  //       this.panen = d['data'];
  //       console.log(this.panen);

  //       for (let index = 0; index < this.panen.length; index++) {

  //         const data = {
  //           position: { lat: this.panen[index].lat, lng: this.panen[index].lng },
  //           draggable: false,
  //           iconUrl:this.panen[index].status=='1'?"../../assets/img/marker-blue.png":"../../assets/img/marker-red.png",
  //           iconShadowUrl:"../../assets/img/marker-shadow.png",
  //         };
  //         const marker = this.generateMarker(data, index);
  //         let html = "<b>Blok:</b>" + this.panen[index].blok + "<br>";
  //         html =  html + "<b>Janjang:</b>" + this.panen[index].hasil_kerja_jjg + "<br>";
  //         // html = html + "<img src='"+ this.PATH_URL+"/"+this.pathName+"/userfiles/panen/"+  this.panen[index].file+"' height='550px' width='650px' >";

  //         marker.addTo(this.map).bindPopup(html);
  //         this.map.panTo(data.position);
  //         this.markers.push(marker)
  //       }

  //     }
  //   )

  }
  view(id: number) {
    let that = this;
    let insp = this.panen[id];

    let modalConfig = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true,
      //size: 'lg',
      class: "modal-lg ",
      initialState: {
        panen: insp
      }
    };
    this.bsModalRef = this.bsModalService.show(ViewPanenComponent, modalConfig);
    this.bsModalRef.content.event.subscribe(result => {
      if (result == 'OK') {
        that.map.eachLayer(function (layer) {
          console.log(layer)
          that.map.removeLayer(layer);
        });
       const lyr= L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&amp;copy; OpenStreetMap contributors',

        });
      lyr.addTo(that.map);
       //that.showData();

      }
    });



  }
}
