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
  baseUrl = `http://skunkworks.ignitesol.com:8000/books/?mime_type=image`;
  nextUrl = ``;
  fetchingData = true;

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
      } else {
        this.showCross = false;
      }
    });
  }

  ngOnInit(): void {
    this.getBooks(`${this.baseUrl}&topic=${this.pageTitle}`);
  }

  getBooks(url: string, scrolled?: boolean) {
    this.fetchingData = true;
    this.http.get(url, {}).subscribe(
      (response: any) => {
        console.log(response);
        this.nextUrl = response.next;
        this.fetchingData = false;

        if (response.results.length) {
          if (this.books.length) {
            this.books = this.books.concat(response.results);
          } else {
            this.books = response.results;
          }
        } else {
          alert(
            `No books found with category ${this.pageTitle}${
              this.searchString.value
                ? ` and named ${this.searchString.value}`
                : ''
            }`
          );
        }
      },
      (err: any) => {
        console.log(err);
        this.fetchingData = false;

        if (scrolled) {
          alert(`Unable to fetch more books with category ${this.pageTitle}`);
        } else {
          alert(`Unable to fetch book with category ${this.pageTitle}`);
        }
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
  onScroll() {
    if (this.nextUrl) {
      this.getBooks(this.nextUrl, true);
    }
  }

  searchBooks() {
    this.books = [];
    if (this.searchString.value) {
      this.getBooks(
        `${this.baseUrl}&topic=${this.pageTitle}&search=${this.searchString.value}`
      );
    } else {
      this.getBooks(`${this.baseUrl}&topic=${this.pageTitle}`);
    }
  }
}
