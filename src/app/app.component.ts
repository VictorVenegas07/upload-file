import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface RegistroArchivo {
  fileId: string;
  NombreArchivo: string;
  fechaCreacion: string;
  EnlaceDescarga: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {
  title = 'upload-file';
  uri = "https://ewzwmo3kwk.execute-api.us-east-1.amazonaws.com/myfile";
  tiposContenido = [
    { type: 'application/pdf', value: 'fas fa-file-pdf' },
    { type: 'image/jpeg', value: 'fas fa-file-image' },
    { type: 'text/plain', value: 'fas fa-file-alt' },
    { type: 'text/html', value: 'fas fa-code' },
    { type: 'text/csv', value: 'fas fa-file-csv' },
    { type: 'application/zip', value: 'fas fa-file-archive' },
    { type: 'application/json', value: 'fas fa-code' },
    { type: 'application/xml', value: 'fas fa-code' },
    { type: 'audio/mpeg', value: 'fas fa-file-audio' },
    { type: 'video/mp4', value: 'fas fa-file-video' },
  ];
  
  uploadedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  uploadDate: Date | null = null;
  registros: RegistroArchivo[] = [];
  
  constructor(private http: HttpClient) {}


  ngOnInit() {
    this.obtenerRegistros();
  }
  getIconClass(fileType: string): string {
    const tipo = this.tiposContenido.find(item => item.type === fileType);
    return tipo ? tipo.value : '';
  }

  onFileUpload() {
    if (this.uploadedFile) {
      this.uploadDate = new Date();
      console.log('Archivo subido:', this.uploadedFile);
      const reader = new FileReader();
      reader.readAsDataURL(this.uploadedFile);
      reader.onload = () => {
        const base64String = reader.result?.toString().split(',')[1]; // Obtener el contenido base64
        debugger
          let body = {
            nombre: this.uploadedFile!.name,
            contentType: this.uploadedFile!.type,
            archivo: base64String
          };
          fetch(this.uri, {
            method: 'POST',
            body: JSON.stringify(body)
          })
          .then(data => {
            console.log(data);
            alert('Archivo subido correctamente.');
          })
          .catch(error => {
            console.error('Error al subir el archivo:', error);
            alert('Hubo un error al subir el archivo.');
          });
    
      };
    } else {
      console.error('No se ha seleccionado ningún archivo.');
    }


  }
  obtenerRegistros() {
    this.http.get<RegistroArchivo[]>(this.uri)
      .subscribe((data) => {
        this.registros = data;
      }, (error) => {
        console.error('Error al obtener los registros:', error);
        alert('Hubo un error al obtener los registros.');
      });
  }
  handleFileInput(event: any) {
    const file: File = event.target.files[0];
    this.uploadedFile = file;
    this.previewFile(file);
  }

  previewFile(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.previewUrl = reader.result;
    };
  }
}
