import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
})
export class BooksComponent implements OnInit {
  books: any = [];
  pageTitle = `Loading...`;
  searchString = new FormControl('');
  showCross = false;
  inputBorder = false;
  baseUrl = `http://skunkworks.ignitesol.com:8000/books/`;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.route.params.subscribe((param) => {
      console.log(param);
      this.pageTitle = param['type'];
    });

    this.searchString.valueChanges.subscribe((value) => {
      if (value) {
        this.showCross = true;
        console.log(this.showCross);
      } else {
        this.showCross = false;
      }
    });
  }

  ngOnInit(): void {
    this.getBooks(this.baseUrl);
  }

  getBooks(url: string) {
    this.http.get(url, {}).subscribe(
      (response: any) => {
        console.log(response);
        this.books = response.results;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  emptySearch() {
    this.searchString.setValue('');
  }

  backToHome() {
    this.location.back();
  }
  addRemoveBorder(focused: boolean) {
    this.inputBorder = focused;
  }
}
